import os
import sys

def read_env_file(file_path):
    if not os.path.exists(file_path):
        return {}
    with open(file_path, 'r') as file:
        return dict(line.strip().split('=', 1) for line in file if '=' in line and not line.startswith('#'))
def write_env_file(file_path, env_vars):
    with open(file_path, 'w') as file:
        for key, value in env_vars.items():
            file.write(f"{key}={value}\n")

def merge_env_files(base_env, specific_env, output_env):
    base_vars = read_env_file(base_env)
    specific_vars = read_env_file(specific_env)
    
    # Merge variables, giving priority to specific_env without modifying base_env
    merged_vars = {**base_vars, **specific_vars}
    
    write_env_file(output_env, merged_vars)  # Write to the output env file, NOT base_env
    print(f"Merged environment files into {output_env}")

    return merged_vars

def generate_typescript_interfaces(env, env_be, env_fe, output_file):
    # Read environment variables from the three files
    env_vars = read_env_file(env)       # Base environment
    env_be_vars = read_env_file(env_be) # Backend-specific environment
    env_fe_vars = read_env_file(env_fe) # Frontend-specific environment

    # Bindings for TypeScript interfaces
    backend_binding = {**env_vars, **env_be_vars}       # Backend: base + backend-specific
    frontend_binding = {**env_vars, **env_fe_vars}      # Frontend: base + frontend-specific
    package_binding = env_vars                         # Package contains only the base environment
    env_binding = {**env_vars, **env_be_vars, **env_fe_vars}  # ENV_BINDING: base + backend + frontend

    # Writing the TypeScript interface file
    with open(output_file, 'w') as file:
        file.write("// This file is auto-generated. Do not edit it directly.\n\n")
        
        for binding_name, binding_vars in [
            ("BACKEND_BINDING", backend_binding),
            ("FRONTEND_BINDING", frontend_binding),
            ("PACKAGE_BINDING", package_binding),
            ("ENV_BINDING", env_binding)
        ]:
            file.write(f"export interface {binding_name} {{\n")
            for key, value in binding_vars.items():
                file.write(f"  {key}: string;\n")
            file.write("}\n\n")

    print(f"Generated TypeScript interfaces file: {output_file}")

if __name__ == "__main__":
    print("Arguments received:", sys.argv)  # Add this line to debug
    if len(sys.argv) < 4:
        print("Usage: python merge_env.py <base_env_file> <specific_env_file> <output_env_file> [generate_ts]")
        sys.exit(1)
    
    base_env = sys.argv[1]
    specific_env = sys.argv[2]
    output_env = sys.argv[3]
    
    merge_env_files(base_env, specific_env, output_env)

    # Handle the optional "generate_ts" argument
    if len(sys.argv) > 4 and sys.argv[4] == "generate_ts":
        ts_output = "pkg/env/src/index.ts"
        os.makedirs(os.path.dirname(ts_output), exist_ok=True)
        generate_typescript_interfaces(".env", ".env.be", ".env.fe", ts_output)