export default {
    parserPreset: {
        parserOpts: {
            headerPattern: /^\[DR-(\d+)\]\s(\w+):\s(.+)$/,
            headerCorrespondence: ['ticket', 'type', 'subject']
        }
    },
    plugins: [
        {
            rules: {
                'header-match-team-pattern': (parsed) => {
                    const {ticket, type, subject} = parsed;
                    if (ticket === null) {
                        return [false, 'header must start with [DR-<number>]'];
                    }
                    if (!/^\d+$/.test(ticket)) {
                        return [false, 'ticket must be a number'];
                    }
                    if (!subject || subject.trim().length === 0) {
                        return [false, 'subject is required'];
                    }
                    return [true];
                }
            }
        }
    ],
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 100],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [
            2,
            'never',
            ['start-case', 'pascal-case']
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [2, 'always', [
            'feat',
            'fix',
            'docs',
            'style',
            'refactor',
            'perf',
            "dev",
            'test',
            'chore',
            'revert'
        ]],
        'header-match-team-pattern': [2, 'always']
    }
};
