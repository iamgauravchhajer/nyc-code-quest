// Importing modules
import createApp from "./src/app";

// function to start the server
function startServer() {

    // Create an instance of the Express application
    const app = createApp();

    // Get the port from environment variables or use default
    const PORT = process.env.PORT || 5000;

    // Start the server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}

// Start the server
startServer();