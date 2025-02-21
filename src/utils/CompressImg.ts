import * as path from 'path';
import * as os from 'os';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

class CompressImg {
    private static getTempPath(originalPath: string): string {
        // Generate a unique identifier for the temporary file
        const uniqueId = uuidv4();
        const tempPath = path.join(os.tmpdir(), `compressed_${uniqueId}_${path.basename(originalPath)}`);
        return tempPath;
    }

    static async compress(imagePath: string): Promise<string> {
        try {
            const compressedPath = this.getTempPath(imagePath);
            await sharp(imagePath).resize(200).toFile(compressedPath);
            return compressedPath;
        } catch (error) {
            console.log("❌ Compress image failed: ", error);
            throw new Error(error as string);
        }
    }
}
export default CompressImg;