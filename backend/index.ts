import http from "http";

const PORT = 3001;

const app = http.createServer((request, response) => {
    const url = request.headers;
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(`Hello, World! The headers are: ${JSON.stringify(url)}`);
    response.end();
});

app.listen(PORT, () => {
    console.log("Server running on port 3001");
});
