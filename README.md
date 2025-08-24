# TikTok Comment Reply Bot

A powerful Electron-based desktop application that automatically replies to comments on TikTok posts. This bot is designed to help TikTok creators engage with their audience more efficiently by automating comment responses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Electron](https://img.shields.io/badge/electron-37.2.4-blue.svg)

## Features

- 🤖 **Automated Comment Replies**: Automatically respond to comments on TikTok posts
- 🖥️ **Desktop GUI**: User-friendly graphical interface built with Electron
- 📊 **Database Management**: SQLite database for storing comments, settings, and activity logs
- 🔧 **Configurable Settings**: Extensive configuration options for bot behavior
- 🌐 **Proxy Support**: Built-in proxy support for enhanced privacy
- 📱 **Cross-Platform**: Works on Windows, macOS, and Linux
- 🚀 **Background Mode**: Run the bot in the background
- 📈 **Activity Tracking**: Monitor bot activity and performance
- 🎯 **Test Mode**: Test your replies without actually posting them
- 🔄 **Auto-Discovery**: Automatically discover new videos to monitor

## Architecture

The application is built with a modular architecture consisting of several components:

```
TikTokCommentReplyBot/
├── apps/                    # Main application modules
│   ├── daemon/             # Background task runner
│   ├── gui/                # Graphical user interface
│   └── shell/              # Electron shell application
├── packages/               # Shared packages
│   ├── core/               # Core business logic and database
│   └── shared/             # Shared utilities and libraries
└── apps/bin/               # Compiled binaries
```

### Key Components

- **Shell App**: Main Electron application that manages the GUI and system integration
- **Daemon**: Background service that handles the TikTok automation
- **GUI**: User interface built with HTML, CSS, and JavaScript
- **Core**: Database models, services, and business logic
- **Shared**: Common utilities including browser automation, logging, and configuration

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/TikTokCommentReplyBot.git
   cd TikTokCommentReplyBot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the application**

   ```bash
   npm run build
   ```

4. **Copy environment configuration**

   ```bash
   cp .env.example .env
   ```

5. **Configure your environment** by editing the `.env` file with your settings

6. **Run the application**
   ```bash
   npm start
   ```

## Configuration

The bot uses environment variables for configuration. Copy `.env.example` to `.env` and customize the settings:

### Key Configuration Options

```env
# Bot Settings
BOT_STATUS=stopped                     # Bot status: stopped, running, paused
TEST_MODE=true                         # Enable test mode (replies won't be posted)
POST_PER_DAY=10                        # Maximum posts per day
MAX_COMMENTS=50                        # Maximum comments to reply to per video
DELAY_BETWEEN_REPLY=10                 # Delay between replies in seconds

# Browser Settings
BROWSER_HEADLESS=false                 # Run browser in headless mode
BROWSER_TIMEOUT=30000                  # Browser timeout in milliseconds

# Database Settings
DB_PATH=~/.TiktokReplyBot/data/app.sqlite  # Database file path

# Logging Settings
LOG_LEVEL=info                         # Log level: debug, info, warn, error
LOG_DIR=~/.TiktokReplyBot/logs         # Directory for log files
```

### Environment Variables

See [`.env.example`](.env.example) for a complete list of configuration options.

## Usage

### Starting the Application

```bash
# Development mode
npm start

# Production mode
npm run package
```

### Basic Workflow

1. **Configure Settings**: Set up your bot preferences in the GUI or via environment variables
2. **Add TikTok Accounts**: Configure your TikTok accounts in the application
3. **Set Up Replies**: Configure your comment reply templates
4. **Start Bot**: Begin monitoring TikTok posts for new comments
5. **Monitor Activity**: Track bot performance and adjust settings as needed

### Command Line Options

```bash
# Start the application
npm start

# Build for production
npm run package

# Create installers for different platforms
npm run make          # Creates installers for current platform
npm run make:all      # Creates installers for all platforms
```

## Development

### Project Structure

```
├── apps/
│   ├── daemon/task-runner/     # Background task automation
│   ├── gui/                    # Frontend application
│   └── shell/                  # Electron main process
├── packages/
│   ├── core/                   # Core business logic
│   └── shared/                 # Shared utilities
└── config files
```

### Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build all packages**

   ```bash
   npm run build
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Run linting**
   ```bash
   npm run lint
   ```

### Building Task Runner

The task runner is a separate Node.js process that handles the TikTok automation:

```bash
# Build task runner for development
cd apps/daemon/task-runner
npm run build

# Bundle task runner for distribution
npm run bundle          # Windows
npm run bundle:mac      # macOS
```

## Database Schema

The application uses SQLite with the following main tables:

- **settings**: Application configuration
- **bot_accounts**: TikTok account credentials
- **pending_videos**: Videos waiting for processing
- **activities**: Bot activity logs
- **comments**: Comment data and replies
- **videos_queue**: Video processing queue
- **post_commented**: Successfully processed posts
- **hashtags**: Hashtag management

## Troubleshooting

### Common Issues

1. **Bot not starting**

   - Check if TikTok is accessible from your network
   - Verify your credentials in the configuration
   - Check logs for error messages

2. **Database errors**

   - Ensure the database directory exists and is writable
   - Check file permissions
   - Run database migrations if needed

3. **Browser automation issues**
   - Update Puppeteer to the latest version
   - Check if your system meets the requirements for headless Chrome
   - Try running in non-headless mode for debugging

### Debug Mode

Enable debug logging by setting `DEBUG_MODE=true` in your `.env` file:

```env
DEBUG_MODE=true
LOG_LEVEL=debug
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## Contributors

- [motikolorado](https://github.com/motikolorado) - Documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

**This tool is for educational and demonstration purposes only.** Users are responsible for:

- Complying with TikTok's Terms of Service
- Respecting platform automation policies
- Using the tool responsibly and ethically
- Any consequences arising from tool usage

The developers are not responsible for any account suspension or other issues that may result from using this tool.

## Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [issues](https://github.com/yourusername/TikTokCommentReplyBot/issues)
3. Create a new issue with detailed information

## Acknowledgments

- [Electron](https://www.electronjs.org/) - Cross-platform desktop application framework
- [Puppeteer](https://pptr.dev/) - Browser automation library
- [Knex.js](https://knexjs.org/) - SQL query builder
- [SQLite](https://www.sqlite.org/) - Lightweight database engine

---

**Built with ❤️ by Julius George**
