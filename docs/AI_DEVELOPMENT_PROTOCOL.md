# AI Coding OS v1.0 — Canonical Architecture

## Purpose

AI Coding OS is a cross-tool operating layer for long-running software projects.

It separates:
- stable agent behavior
- dynamic project knowledge
- tool-specific adapters
- optional task/domain skills

## Source of Truth

`AGENTS.md`
- canonical cross-tool engineering behavior

`PROJECT_MEMORY.md`
- canonical project state, decisions, failures, deployment notes, unresolved issues

Tool adapters
- only bridge each coding tool to the canonical files
- must stay short
- must not fork the core rules

## Runtime Context Strategy

Always:
AGENTS -> Memory Index -> relevant Memory -> relevant code -> risk-matched verification

Never:
load the entire project or entire memory by default.

## Memory Model

### Facts
What is true now.

### Decisions
What was chosen and why.

### Failures
What was tested and failed, why, evidence, replacement, revalidation conditions.

### State
What is currently being worked on and what remains.

### Human Confirmation
What requires an explicit user decision.

## Change Model

Understand -> smallest change -> verify -> inspect diff/security -> persist durable knowledge -> stop.

## Versioning

AI Coding OS versions are for the protocol itself.
Project Memory is project-specific and must not be treated as a versioned protocol.

## Recommended Extensions

For larger projects, add:
- `.cursor/rules/*.mdc` for file-scoped Cursor rules
- `docs/` for architecture/product documentation
- task-specific skills/scripts
- an initialization script that checks and repairs the standard files

Keep the default runtime context small.
