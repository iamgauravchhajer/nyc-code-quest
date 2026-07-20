// importing modules
import crypto from "crypto";
import env from "../../shared/config/env.config.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";

// class for imagekit controller
class ImagekitController {

    // method to get auth parameters for secure client-side direct uploads
    getAuthParams = async (req, res) => {

        // generate a unique random token
        const token = crypto.randomUUID();

        // set expiration time to 30 minutes in the future (in seconds)
        const expire = Math.floor(Date.now() / 1000) + 1800;

        // calculate hmac signature using imagekit private key as the secret key
        const signature = crypto
            .createHmac("sha1", env.IMAGEKIT_PRIVATE_KEY)
            .update(token + expire)
            .digest("hex");

        return ApiResponse(res, 200, "ImageKit authentication parameters generated successfully", {
            token,
            expire,
            signature,
            publicKey: env.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
        });

    }

}

// exporting controller
export default ImagekitController;
