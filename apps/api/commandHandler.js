const fs = require("fs");
const path = require("path");

/**
 * @typedef {Object} Command
 * @property {string} name - The name of the command
 * @property {string[]} [aliases] - Alternative names for the command
 * @property {(rustplus: any, args: string[], message: string) => void} execute - The function to execute when the command is called
 */

class CommandHandler {
  constructor(commandPrefix = ".") {
    this.commands = new Map();
    this.commandPrefix = commandPrefix;
    this.prefixLength = commandPrefix.length;
  }

  /**
   * Load all commands from the commands directory
   */
  loadCommands() {
    const commandsPath = path.join(__dirname, "commands");
    
    try {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        
        try {
          const command = require(filePath);

          if (command.name && command.execute) {
            this.commands.set(command.name.toLowerCase(), command);
            
            if (command.aliases && Array.isArray(command.aliases)) {
              for (const alias of command.aliases) {
                this.commands.set(alias.toLowerCase(), command);
              }
            }
          } else {
            console.warn(
              `Command file ${file} is missing required properties (name or execute)`
            );
          }
        } catch (err) {
          console.error(`Failed to load command ${file}:`, err);
        }
      }
    } catch (err) {
      console.error("Failed to load commands directory:", err);
    }
  }

  /**
   * Handle an incoming message and execute command if it matches
   * @param {string} message - The message to handle
   * @param {any} rustplus - The RustPlus instance
   * @returns {boolean} - Whether a command was executed
   */
  handleMessage(message, rustplus) {
    if (!message || !message.trim().startsWith(this.commandPrefix)) {
      return false;
    }

    const withoutPrefix = message.trim().slice(this.prefixLength);
    if (!withoutPrefix) return false;
    
    const parts = withoutPrefix.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return false;
    
    const commandName = parts.shift().toLowerCase();
    const args = parts;

    const command = this.commands.get(commandName);
    if (!command) {
      return false;
    }

    try {
      console.log(`Executing command: ${command.name}`);
      command.execute(rustplus, args, message);
      return true;
    } catch (error) {
      console.error(`Error executing command ${command.name}:`, error);
      return false;
    }
  }

  /**
   * Get all registered commands
   * @returns {Map<string, Command>}
   */
  getCommands() {
    return this.commands;
  }
}

module.exports = CommandHandler;
