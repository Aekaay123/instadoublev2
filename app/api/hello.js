// write a api route cotroller code to send hello as response when users vsisit api/hello route
export default async function handler(req, res) {
    res.status(200).json({ message: "hello" });
}