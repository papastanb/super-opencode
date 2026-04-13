import type { TuiDialogSelectOption, TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

import { detectFrameworkScopes, installFramework, statusFramework, uninstallFramework, updateFramework } from "./framework/engine.js"
import type { FrameworkAction, FrameworkReport, Scope } from "./framework/types.js"

function summarizeReport(report: FrameworkReport): string {
  const summary = [
    `Action: ${report.action}`,
    `Scope: ${report.scope}`,
    `Restart required: ${report.restartRequired ? "yes" : "no"}`,
  ]

  const conflicts = report.items.filter((item) => item.status === "conflict/manual action required")
  const changed = report.items.filter((item) => item.status === "installed" || item.status === "updated" || item.status === "removed")
  const alreadyCurrent = report.items.filter((item) => item.status === "already up to date")

  summary.push(`Changed items: ${changed.length}`)
  summary.push(`Already current: ${alreadyCurrent.length}`)
  if (conflicts.length > 0) {
    summary.push(`Conflicts: ${conflicts.length}`)
  }

  return summary.join("\n")
}

const tui: TuiPlugin = async (api) => {
  const projectRoot = () => {
    const worktree = api.state.path.worktree
    if (worktree && worktree !== "/") {
      return worktree
    }

    return api.state.path.directory
  }

  let promptedThisSession = false

  const runAction = async (action: FrameworkAction, scope: Scope) => {
    const sharedOptions = {
      scope,
      projectRoot: projectRoot(),
      env: process.env,
    }

    try {
      const report =
        action === "install"
          ? await installFramework(sharedOptions)
          : action === "status"
            ? await statusFramework(sharedOptions)
            : action === "update"
              ? await updateFramework(sharedOptions)
              : await uninstallFramework(sharedOptions)

      api.ui.dialog.replace(() =>
        api.ui.DialogAlert({
          title: "Super OpenCode",
          message: summarizeReport(report),
          onConfirm: () => {
            api.ui.dialog.clear()
          },
        }),
      )
    } catch (error) {
      api.ui.dialog.replace(() =>
        api.ui.DialogAlert({
          title: "Super OpenCode Error",
          message: error instanceof Error ? error.message : String(error),
          onConfirm: () => {
            api.ui.dialog.clear()
          },
        }),
      )
    }
  }

  const openScopeDialog = (action: FrameworkAction) => {
    const options: TuiDialogSelectOption<Scope>[] = [
      {
        title: "Project scope (recommended)",
        value: "project",
        description: "Sync into .opencode and opencode.json for the current repo.",
      },
      {
        title: "Global scope",
        value: "global",
        description: "Sync into ~/.config/opencode without touching the current project.",
      },
    ]

    api.ui.dialog.replace(() =>
      api.ui.DialogSelect({
        title: "Choose Super OpenCode scope",
        options,
        onSelect: (option) => {
          void runAction(action, option.value)
        },
      }),
    )
  }

  const openMainDialog = () => {
    const options: TuiDialogSelectOption<FrameworkAction>[] = [
      {
        title: "Bootstrap / install",
        value: "install",
        description: "Install or resync framework assets for a chosen scope.",
      },
      {
        title: "Status",
        value: "status",
        description: "Inspect the current framework install state and MCP diagnostics.",
      },
      {
        title: "Update",
        value: "update",
        description: "Refresh assets and config using the latest package contents.",
      },
      {
        title: "Uninstall",
        value: "uninstall",
        description: "Remove the framework from a chosen scope.",
      },
    ]

    api.ui.dialog.replace(() =>
      api.ui.DialogSelect({
        title: "Super OpenCode",
        options,
        onSelect: (option) => {
          openScopeDialog(option.value)
        },
      }),
    )
  }

  api.command.register(() => [
    {
      title: "Super OpenCode",
      value: "super-opencode.framework",
      description: "Bootstrap, diagnose, update, or uninstall the framework.",
      category: "Plugins",
      onSelect: openMainDialog,
    },
  ])

  try {
    const scopes = await detectFrameworkScopes({ projectRoot: projectRoot(), env: process.env })
    if (!promptedThisSession && scopes.every((entry) => !entry.installed)) {
      promptedThisSession = true
      openScopeDialog("install")
    }
  } catch {
    // Keep the plugin usable through the command palette even if bootstrap state detection fails.
  }
}

const pluginModule: TuiPluginModule & { id: string } = {
  id: "super-opencode-framework",
  tui,
}

export default pluginModule
