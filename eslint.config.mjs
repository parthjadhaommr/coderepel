// eslint.config.js
import antfu from "@antfu/eslint-config"

export default antfu(
    {
        type: "app",       // good for monorepo apps
        typescript: true,  // enable TypeScript support
        nextjs: true,      // enable Next.js rules
        react: true,       // ensure React rules for ui package
        formatters: true,  // prettier-like formatting
        stylistic: {
            indent: 2,
            semi: true,
            quotes: "double",
        },
    },
    {
        ignores: [
            ".vscode",
            ".github/workflow/*.yaml",
            "node_modules",
            "packages/db/prisma/migrations/**",
            "packages/db/prisma/migration_lock.toml",
            "packages/db/generated/prisma/**",
            "dist",
            "build",
            ".next",
            "**/*.json",
            "**/*.md",
            "**/*.config.*",
        ],
    },
    {
        rules: {
            '@next/next/no-html-link-for-pages': 'off',
            "ts/no-redeclare": "off",
            "ts/consistent-type-definitions": ["error", "type"],
            "no-console": ["warn"],
            "antfu/no-top-level-await": "off",
            "node/prefer-global/process": "off",
            "node/no-process-env": "error",
            "perfectionist/sort-imports": ["error", { tsconfigRootDir: "." }],
            "unicorn/filename-case": [
                "error",
                {
                    case: "kebabCase",
                    ignore: ["README.md"],
                },
            ],
        },
    },
    {
        files: ["apps/backend/**/*.{ts,tsx}"],
        rules: {
            // backend-specific overrides
            "no-alert": "off", // alert is not used in backend anyway
            "next/no-html-link-for-pages": "off", // not relevant for backend
            "node/no-process-env": "off",
            "no-console": "off",
        },
    },
    {
        files: ["packages/ui/**/*.{ts,tsx}"],
        rules: {
            // shared UI package overrides if needed
            "no-console": "off", // allow console in UI package
            "no-alert": "off",   // allow alert in demo components
        },
    },
)