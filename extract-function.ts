import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface FunctionInfo {
  name: string;
  filePath: string;
  line: number;
  column: number;
  parameters: {
    name: string;
    type: string;
    optional: boolean;
  }[];
  returnType: string;
  isAsync: boolean;
  isExported: boolean;
  kind: 'function' | 'method' | 'arrow' | 'constructor';
  semanticContext: {
    jsDoc?: string;
    leadingComments?: string[];
    className?: string;
    namespace?: string;
    parentFunction?: string;
    calledFunctions?: string[];
    usedVariables?: string[];
  };
}

class FunctionExtractor {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private functions: FunctionInfo[] = [];

  constructor(configPath: string) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(configPath)
    );

    this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    this.checker = this.program.getTypeChecker();
  }

  extract(): FunctionInfo[] {
    for (const sourceFile of this.program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile && this.shouldProcessFile(sourceFile.fileName)) {
        this.visitNode(sourceFile);
      }
    }
    return this.functions;
  }

  private shouldProcessFile(fileName: string): boolean {
    const normalizedPath = path.normalize(fileName);
    const relativePath = path.relative(process.cwd(), normalizedPath);
    
    // Skip this extractor file itself
    if (normalizedPath.includes('extract-function') || relativePath.includes('extract-function')) {
      return false;
    }
    
    // Skip generated files
    if (normalizedPath.includes('routeTree.gen.ts') || relativePath.includes('routeTree.gen.ts')) {
      return false;
    }
    
    // Skip build/dist directories and their contents
    const buildDirectories = [
      'node_modules',
      'dist',
      'build',
      'out',
      'lib',
      '.next',
      '.nuxt',
      'coverage',
      '.git',
      'public', // Often contains built assets
      'static'  // Often contains built assets
    ];
    
    if (buildDirectories.some(dir => {
      const dirPath = dir + path.sep;
      return relativePath.includes(dirPath) || relativePath.startsWith(dirPath) || relativePath === dir;
    })) {
      return false;
    }
    
    // Only process TypeScript and JavaScript source files
    const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    if (!validExtensions.some(ext => normalizedPath.endsWith(ext))) {
      return false;
    }
    
    return true;
  }

  private visitNode(node: ts.Node): void {
    if (this.isFunctionLike(node)) {
      this.extractFunctionInfo(node);
    }
    ts.forEachChild(node, child => this.visitNode(child));
  }

  private isFunctionLike(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return ts.isFunctionDeclaration(node) ||
           ts.isMethodDeclaration(node) ||
           ts.isArrowFunction(node) ||
           ts.isFunctionExpression(node) ||
           ts.isConstructorDeclaration(node) ||
           ts.isGetAccessorDeclaration(node) ||
           ts.isSetAccessorDeclaration(node);
  }

  private extractFunctionInfo(node: ts.FunctionLikeDeclaration): void {
    const sourceFile = node.getSourceFile();
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    
    const symbol = this.checker.getSymbolAtLocation(node.name || node);
    const name = this.getFunctionName(node, symbol);
    
    if (!name) return; // Skip anonymous functions without context

    const signature = this.checker.getSignatureFromDeclaration(node);
    if (!signature) return;

    const parameters = signature.parameters.map(param => {
      const paramType = this.checker.getTypeOfSymbolAtLocation(param, node);
      return {
        name: param.getName(),
        type: this.checker.typeToString(
          paramType,
          node,
          ts.TypeFormatFlags.InTypeAlias | 
          ts.TypeFormatFlags.NoTruncation |
          ts.TypeFormatFlags.WriteArrayAsGenericType |
          ts.TypeFormatFlags.UseFullyQualifiedType
        ),
        optional: (param.valueDeclaration as ts.ParameterDeclaration)?.questionToken !== undefined
      };
    });

    const returnType = this.checker.typeToString(
      signature.getReturnType(),
      node,
      ts.TypeFormatFlags.InTypeAlias | 
      ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.WriteArrayAsGenericType |
      ts.TypeFormatFlags.UseFullyQualifiedType
    );
    const semanticContext = this.extractSemanticContext(node);
    
    const functionInfo: FunctionInfo = {
      name,
      filePath: sourceFile.fileName,
      line: line + 1,
      column: character + 1,
      parameters,
      returnType,
      isAsync: node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword) || false,
      isExported: this.isExported(node),
      kind: this.getFunctionKind(node),
      semanticContext
    };

    this.functions.push(functionInfo);
  }

  private extractSemanticContext(node: ts.FunctionLikeDeclaration): FunctionInfo['semanticContext'] {
    const context: FunctionInfo['semanticContext'] = {};
    
    // Extract JSDoc comments
    const jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags.length > 0) {
      context.jsDoc = jsDocTags.map(tag => tag.getFullText().trim()).join('\n');
    }
    
    // Extract leading comments
    const sourceFile = node.getSourceFile();
    const leadingComments = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart());
    if (leadingComments) {
      context.leadingComments = leadingComments.map(comment => 
        sourceFile.text.substring(comment.pos, comment.end).trim()
      );
    }
    
    // Extract class context if it's a method
    if (ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node)) {
      const classDeclaration = node.parent;
      if (ts.isClassDeclaration(classDeclaration) && classDeclaration.name) {
        context.className = classDeclaration.name.text;
      }
    }
    
    // Extract namespace context
    let parent = node.parent;
    while (parent) {
      if (ts.isModuleDeclaration(parent) && parent.name) {
        context.namespace = parent.name.getText();
        break;
      }
      parent = parent.parent;
    }
    
    // Extract parent function context (for nested functions)
    let functionParent = node.parent;
    while (functionParent && !ts.isSourceFile(functionParent)) {
      if (this.isFunctionLike(functionParent) && functionParent !== node) {
        const parentName = this.getFunctionName(functionParent);
        if (parentName) {
          context.parentFunction = parentName;
          break;
        }
      }
      functionParent = functionParent.parent;
    }
    
    // Extract called functions and used variables from function body
    if (node.body) {
      const analysis = this.analyzeFunctionBody(node.body);
      context.calledFunctions = analysis.calledFunctions;
      context.usedVariables = analysis.usedVariables;
    }
    
    return context;
  }

  private analyzeFunctionBody(body: ts.Node): { calledFunctions: string[], usedVariables: string[] } {
    const calledFunctions = new Set<string>();
    const usedVariables = new Set<string>();
    
    const visit = (node: ts.Node) => {
      // Detect function calls
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isIdentifier(expression)) {
          calledFunctions.add(expression.text);
        } else if (ts.isPropertyAccessExpression(expression)) {
          calledFunctions.add(expression.name.text);
        }
      }
      
      // Detect variable usage
      if (ts.isIdentifier(node) && !ts.isPropertyAccessExpression(node.parent)) {
        // Skip function names and property names
        if (!ts.isCallExpression(node.parent) || node.parent.expression !== node) {
          usedVariables.add(node.text);
        }
      }
      
      ts.forEachChild(node, visit);
    };
    
    visit(body);
    
    return {
      calledFunctions: Array.from(calledFunctions).slice(0, 10), // Limit to avoid clutter
      usedVariables: Array.from(usedVariables).slice(0, 10)
    };
  }

  private getFunctionName(node: ts.FunctionLikeDeclaration, symbol?: ts.Symbol): string | null {
    if (node.name) {
      return node.name.getText();
    }
    
    if (symbol) {
      return symbol.getName();
    }

    // Handle arrow functions assigned to variables
    if (ts.isArrowFunction(node) && node.parent) {
      if (ts.isVariableDeclaration(node.parent) && node.parent.name) {
        return node.parent.name.getText();
      }
      if (ts.isPropertyAssignment(node.parent) && node.parent.name) {
        return node.parent.name.getText();
      }
    }

    return null;
  }

  private getFunctionKind(node: ts.FunctionLikeDeclaration): FunctionInfo['kind'] {
    if (ts.isConstructorDeclaration(node)) return 'constructor';
    if (ts.isMethodDeclaration(node)) return 'method';
    if (ts.isArrowFunction(node)) return 'arrow';
    return 'function';
  }

  private isExported(node: ts.FunctionLikeDeclaration): boolean {
    return node.modifiers?.some(mod => 
      mod.kind === ts.SyntaxKind.ExportKeyword || 
      mod.kind === ts.SyntaxKind.DefaultKeyword
    ) || false;
  }
}

// Find all tsconfig.json files in the project structure
function findTsConfigFiles(): string[] {
  const patterns = [
    'fe/*/tsconfig.json',
    'be/*/tsconfig.json', 
    'pkg/*/tsconfig.json',
    'lib/*/tsconfig.json'
  ];
  
  const tsconfigs: string[] = [];
  
  for (const pattern of patterns) {
    const [baseDir, subPattern] = pattern.split('/');
    
    if (fs.existsSync(baseDir)) {
      const subdirs = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const subdir of subdirs) {
        const tsconfigPath = path.join(baseDir, subdir, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
          tsconfigs.push(tsconfigPath);
        }
      }
    }
  }
  
  return tsconfigs;
}

// Usage
function extractFunctions(tsconfigPaths?: string[]): void {
  try {
    let configsToProcess: string[];
    
    if (tsconfigPaths && tsconfigPaths.length > 0) {
      configsToProcess = tsconfigPaths;
    } else {
      configsToProcess = findTsConfigFiles();
      if (configsToProcess.length === 0) {
        // Fallback to default if no configs found
        if (fs.existsSync('./tsconfig.json')) {
          configsToProcess = ['./tsconfig.json'];
        } else {
          console.error('No tsconfig.json files found. Please specify a path or ensure your project structure matches fe/*/tsconfig.json, be/*/tsconfig.json, pkg/*/tsconfig.json, or lib/*/tsconfig.json');
          return;
        }
      }
    }
    
    console.log(`Found ${configsToProcess.length} tsconfig files:`);
    configsToProcess.forEach(config => console.log(`  - ${config}`));
    console.log('');
    
    const allFunctions: FunctionInfo[] = [];
    const projectSummary: { [project: string]: number } = {};
    
    for (const tsconfigPath of configsToProcess) {
      console.log(`Processing ${tsconfigPath}...`);
      try {
        const extractor = new FunctionExtractor(tsconfigPath);
        const functions = extractor.extract();
        allFunctions.push(...functions);
        
        const projectName = path.dirname(tsconfigPath);
        projectSummary[projectName] = functions.length;
        console.log(`  Found ${functions.length} functions`);
      } catch (error) {
        console.error(`  Error processing ${tsconfigPath}:`, error);
      }
    }
    
    const output = {
      extractedAt: new Date().toISOString(),
      totalFunctions: allFunctions.length,
      functions: allFunctions
    };

    const outputPath = 'function-signatures.json';
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\nExtracted ${allFunctions.length} total functions to ${outputPath}`);
    
  } catch (error) {
    console.error('Error extracting functions:', error);
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const specifiedPaths = process.argv.slice(2);
  extractFunctions(specifiedPaths.length > 0 ? specifiedPaths : undefined);
}

export { FunctionExtractor, FunctionInfo };
