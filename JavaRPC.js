import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

public class XboxConsole {
    private BufferedReader consoleInputReader;
    private DataOutputStream consoleOutputStream;
    private Socket consoleSocket;

    // Constructor to connect to console with a specified IP and port
    public XboxConsole(String ip, int port) throws IOException {
        try {
            consoleSocket = new Socket(ip, port);
            consoleOutputStream = new DataOutputStream(consoleSocket.getOutputStream());
            consoleInputReader = new BufferedReader(new InputStreamReader(consoleSocket.getInputStream()));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    // Overloaded constructor with default port 730
    public XboxConsole(String ip) {
        try {
            consoleSocket = new Socket(ip, 730);
            consoleOutputStream = new DataOutputStream(consoleSocket.getOutputStream());
            consoleInputReader = new BufferedReader(new InputStreamReader(consoleSocket.getInputStream()));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    // Sends a command to the console
    private void sendCommand(String command) {
        try {
            consoleOutputStream.writeBytes(command + "\r\n");
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    // Sets memory at a specific address
    public void setMemory(String address, String data) {
        this.sendCommand(String.format("setmem addr=0x%s data=%s", address, data));
    }

    // Shows a notification on the console
    public void xNotify(String message, NotificationType notificationType) {
        int stringTypeIdentifier = 2; // Identifier for string type
        int integerTypeIdentifier = 1; // Identifier for integer type

        String command = "consolefeatures ver=2 type=12 params=\"A\\0\\A\\2\\" +
                stringTypeIdentifier + "/" +
                message.length() + "\\" +
                toHex(message) + "\\" +
                integerTypeIdentifier + "\\";

        // Append specific type of notification to the command
        switch (notificationType) {
            case PLAIN:
                command += "0\\\"";
                break;
            case INVITE:
                command += "1\\\"";
                break;
            case FRIEND:
                command += "2\\\"";
                break;
            default:
                command += "0\\\"";
                break;
        }
        this.sendCommand(command);
    }

    // Gets the memory content from a specific address with a given length
    public String getMemory(String address, String length) {
        try {
            this.sendCommand(String.format("getmemex addr=0x%s length=%s", address, length));
            while (true) {
                String response = this.consoleInputReader.readLine();
                if (response.endsWith("203- binary response follows")) {
                    int bufferLength = Integer.parseInt(length) + 2;
                    char[] buffer = new char[bufferLength];
                    this.consoleInputReader.read(buffer, 0, bufferLength);

                    StringBuilder result = new StringBuilder();
                    for (int i = 2; i < bufferLength; i++) {
                        result.append(buffer[i]);
                    }
                    return result.toString();
                }
            }
        } catch (IOException ex) {
            ex.printStackTrace();
            return "error";
        }
    }

    // Enum for different notification types
    public enum NotificationType {
        PLAIN,
        INVITE,
        FRIEND
    }

    // Converts a string to its hexadecimal representation
    public String toHex(String input) {
        StringBuilder hexString = new StringBuilder();
        for (int i = 0; i < input.length(); i++) {
            hexString.append(Integer.toHexString(input.charAt(i)));
        }
        return hexString.toString();
    }
}
