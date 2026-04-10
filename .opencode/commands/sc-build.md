---
description: Build, compile, and package projects with intelligent error handling and optimization
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:build`.

Build `$ARGUMENTS`.

Behavior:
- analyze project structure, build configurations, and dependency manifests
- validate build environment, dependencies, and required toolchain
- execute build process with error detection and monitoring
- optimize build artifacts and apply environment-specific optimizations
- generate deployment-ready artifacts with build reports

MCP Integration:
- playwright MCP for build validation and UI testing
- devops-architect persona for build optimization and deployment preparation

Output:
- build artifacts
- build report with timing metrics
- error diagnostics if failures occur

Boundary:
- do not modify build system configuration or create new build scripts
- do not install missing build dependencies
- do not execute deployment operations beyond artifact preparation