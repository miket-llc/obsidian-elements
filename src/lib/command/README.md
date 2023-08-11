# cmd - Elements Plugin Commands

Application-specific API and implemntation for Elements commands. Commands are the primary way that users interact with the Elements Plugin. Commands are registered with the application and can be executed by the user via the application Command Palette or a hotkey. Commands can also be executed  by the Elements plugin.

## Base Classes

All Elements plugin commands should inherit from the following base classes.

1. `cmd/base-classes/BasicCommannd` - Base class for all Elements Plugin commands.
2. `cmd/base-classes/CheckCommand` - Base class for commands that check to see if they are valid in the current context. 
3. `cmd/base-classes/EditorCommand` - Base class for commands related to the Obsidian editor.
4. `cmd/base-classes/EditorCheckCommand` - Base class for commands related to the Obsidian Editor that check if they are valid in the current context.

These four classes are analogous to the four callback types in Obsidian (`callback, checkCallback, editorCallback, and editorCheckCallback). They serve to encapuslate the Obsidian API and provide a more clean, typesafe interface for the Command developer.

### Choosing a Base Class

1. `BasicCommand` - Use this base class if your command only needs access to the Elements Plugin and API. This is the most basic command type and is useful for commands that can be executed any time in any context by the application or plugin.
2. `CheckCommand` - Use this base class if your command is only valid under certain conditions. You get to decide what these conditions are. As a result, the application 

## Command Registration

TODO

## Creating a Command

### 1. Create a new `.ts` file

Give this class a descriptive name that describes what the command does. It's okay if this name is a little long compared to other class names.

```bash
touch ./DoSomethingCool.ts
```
### 2. Import the base class and inherit it

Open your new file in an editor and inherit the base class that you want to use. For example, if you want to create a command that is only valid in certain contexts, you would import `CheckCommand`.

```ts
// For users of this library
import { CheckCommand } from "obsidian-elements"

// For developers of this library
import { CheckCommand } from "../base-classes/CheckCommand"

export class DoSomethingCool extends CheckCommand {
  // ...
}
```

### 3. Create a constructor for your class 

Your constructor should take no arguments and must call `super()` with a valid `CommandProperties` You must call  and pass in the command name and any other arguments that the base class requires. For example, if you are using `CheckCommand`, you should pass in a `checkCallback` function.

```ts
export class DoSomethingCool extends CheckCommand {
  constructor() { 
    super({
        id: 'move-to-best-folder',
        name: 'Move note to most appropriate folder',
        icon: 'atom',
        hotkeys: [],
        mobileOnly: false,
        repeatable: false
    })
  }
}
```
