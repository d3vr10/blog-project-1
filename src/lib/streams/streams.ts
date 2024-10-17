import fs from "node:fs";

export async function* nodeStreamToGenerator(stream: fs.ReadStream) {
    for await (const chunk of stream) {
        yield new Uint8Array(chunk);
    }

}

export function iteratorToReadableStream(iterator: AsyncIterator<Uint8Array>) {
    return new ReadableStream({
        async pull(controller) {
            const {value, done} = await iterator.next();
            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }

        }
    })
}

export function streamFile(path: string) {
    const nodeStream = fs.createReadStream(path)
    return iteratorToReadableStream(
        nodeStreamToGenerator(nodeStream)
    )

}