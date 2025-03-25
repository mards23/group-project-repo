export function errorHandler(err: any, req: any, res: any, next: any) {
    switch (err.name) {
        case "ValidationError":
            return res.status(400).json({ message: err.message });
        default:
            return res.status(500).json({ message: err.message });
    }
}