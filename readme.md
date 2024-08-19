# Java-JRPC

Java-JRPC is a very simple Java based JRPC library which provides a way to interact with a Jtag/RGH Xbox 360 console.

## Installation

**Clone the Repository**:
   ```bash
   git clone https://github.com/huskeyyy/java-jrpc.git
```

## Usage

**Creating an Instance**
   ```java
// Create an instance with a specific IP and port
XboxConsole xbox = new XboxConsole("192.168.1.2", 21);

// Or with default port 730
XboxConsole xbox = new XboxConsole("192.168.1.2");
```

**Sending Commands**
   ```java
// Set memory at address 0x83D077F0 with data "0x60, 0x00, 0x00, 0x00"
xbox.setMemory("1000", "0x60, 0x00, 0x00, 0x00");

// Shows a plain xNotify
xbox.xNotify("Hello, Xbox!", XboxConsole.NotificationType.PLAIN);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This library is provided under the MIT License. See the LICENSE file for details.
