# Foundation Guide

This document captures detailed conventions and architectural notes for the Ember Studio Foundation.

## Foundation conventions

- Keep reusable infrastructure in the shared folders (`src/app`, `src/shell`, `src/design-system`, `src/windows`, `src/external-windows`, `src/file-system`, `src/settings`, `src/notifications`, `src/dialogs`, `src/tooltips`, `src/feedback`).
- Put application-specific behavior under `src/features/<feature-name>`.
- Keep file processing, persistence, and long-running work behind typed services instead of React components.
- Use the project-owned design tokens and shared feedback components when adding UI.
- Treat Tauri commands as a native boundary with JSON-compatible contracts.

## Windows acceptance

The frontend test suite, TypeScript project check, and Vite production build run in this repository. Before shipping a Windows application based on this template, also validate the native Tauri build and runtime behavior on Windows, including borderless dragging, resize edges and corners, minimize/maximize/restore, multi-monitor placement, per-monitor DPI, external feature windows, and saved window state.

## Backend integration

Future local services can replace adapters without changing feature components. A Java, Python, Rust, or C# worker can communicate through a Tauri command, local HTTP, WebSocket, JSON message channel, or another documented transport. Long-running work should report progress and cancellation asynchronously rather than blocking the React UI thread.

## GitHub automation

The repository includes three lightweight GitHub automations:

- **CI** runs the frontend tests, TypeScript check, Vite build, and a Windows native `cargo check`.
- **CodeQL** scans the JavaScript/TypeScript source for security problems and coding errors.
- **Dependabot** opens weekly dependency update pull requests for npm and Cargo packages.

These checks are designed to run before changes are merged into `main`.
