"use server";

const trackingRegistry: any = {}

function rateLimitFactory(params: {
    limit: number,
    timeWindow?: number,
}) {
    if (!params.timeWindow)
        params.timeWindow = 24 * 60 * 60 * 1000
    else params.timeWindow = params.timeWindow * 1000
    const { limit, timeWindow } = params;

    return async (id: string) => {
        const now = Date.now()

        if (!trackingRegistry[id]) {
            trackingRegistry[id] = {
                uploadCount: 0,
                lastUploadTime: null,
            }
        }
        const record = trackingRegistry[id]
        if (record.lastUploadTime && (now - record.lastUploadTime) < timeWindow) {
            if (record.uploadCount >= limit) {
                const waitTime = new Date(timeWindow - (now - record.lastUploadTime))
                return {
                    status: 429,
                    error: {
                        message: `Max uploads reached: ${limit}. Wait ${waitTime.getHours()}h:${waitTime.getMinutes()}m:${waitTime.getSeconds()}s.`,
                        detail: `ID "${id}" has exceeded max file uploads`,
                    }
                }

            }
        }

        record.lastUploadTime = now
        record.uploadCount++
        return {
            status: 200,
            message: "Upload is allowed"
        }
    }
}

async function resetUploadCount() {
    
}
export const rateLimit = rateLimitFactory({ limit: 5, timeWindow: 60 * 60 * 24 })