---
name: new-task
description: Create a new task file in scratch/ from the task template for tracking ABAP development work.
argument-hint: "[task-name]"
allowed-tools: ["Bash"]
---

# New Task

Create a new task file in scratch/ from the task template.

Run the appropriate command for the current platform, where $ARGUMENTS is used as the task name:

**Windows (Git Bash / MSYS):**
```bash
bash $CLAUDE_PLUGIN_ROOT/scripts/vsp-task.sh "$ARGUMENTS"
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File "$env:CLAUDE_PLUGIN_ROOT\scripts\vsp-task.ps1" -Name "$ARGUMENTS"
```

**macOS / Linux:**
```bash
bash $CLAUDE_PLUGIN_ROOT/scripts/vsp-task.sh "$ARGUMENTS"
```

Detect the platform automatically using `$OSTYPE` and run the correct script.

If $ARGUMENTS is empty, use "new-task" as the default name.

After the script runs:
1. Display the full path of the created file
2. Show the user the task template structure so they can fill in the request details
3. Remind them to paste the original user request into the "Request" section
