import { NextRequest, NextResponse } from "next/server";
import requestIp from "request-ip"
// src/app/api/upload/route.js
const uploadRecords: any = {}; // In-memory storage for upload counts

export async function POST(req: NextRequest) {
    const ipAddress = requestIp.getClientIp(req as any); // Get userId from request body
    if (!ipAddress) {
        return NextResponse.json({
            message: 'We are sorry but we cannot accept requests from an "unknown" location.'
        }, { status: 403 })
    }

    const now = Date.now();

    // Initialize record if it doesn't exist
    if (!uploadRecords[ipAddress]) {
        uploadRecords[ipAddress] = {
            uploadCount: 0,
            lastUploadTime: null,
        };
    }
    const record = uploadRecords[ipAddress];

    // Check if 24 hours have passed since the last upload
    if (record.lastUploadTime && (now - record.lastUploadTime) < 24 * 1000 * 1000) {
        if (record.uploadCount >= 5) {
            return NextResponse.json({ message: 'Upload limit reached. Please try again later.' }, { status: 429 });
        }
    } else {
        // Reset count if more than 24 hours have passed
        record.uploadCount = 0;
    }

    // Increment the upload count and update the last upload time
    record.uploadCount++;
    record.lastUploadTime = now;

    // Handle file upload logic here (e.g., saving to S3)

    return NextResponse.json({ message: 'File can be uploaded!', currentCount: record.uploadCount }, { status: 200 });
}

export async function PUT(req: NextRequest) {
    const ipAddress = requestIp.getClientIp(req as any);
    if (!ipAddress) {
        return NextResponse.json({
            status: 403,
            error: {
                message: 'We are sorry but we cannot accept requests from an "unknown" location.'
            }
        }, { status: 403 })
    }
    const record = uploadRecords[ipAddress]
    if (record) {
        record.uploadCount = 0
        return NextResponse.json({
            status: 200,
            message: "Reset upload count",

        })
    }
    return NextResponse.json({
        status: 404,
        error: {
            message: "Tracking registry not found"
        }
    }, { status: 404 })
}