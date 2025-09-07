import { supabase } from "./superbaseClient";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = supabase;
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder, userId }: UploadProps & { userId: string }) => {
  const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
  const fileName = `${userId}.${fileExtension}`; // fixed filename per user
  const path = `${folder ? folder + "/" : ""}${fileName}`;

  try {
    file = await imageCompression(file, { maxSizeMB: 1 });
  } catch (error) {
    console.error(error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();

  // Use upsert:true so it replaces existing file
  const { data, error } = await storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) {
    return { imageUrl: "", error: "Image upload failed" };
  }

  // Add cache-busting param to force refresh
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}?t=${Date.now()}`;

  return { imageUrl, error: "" };
};



// export const deleteImage = async (imageUrl: string) => {
//   const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
//   const firstSlashIndex = bucketAndPathString.indexOf("/");

//   const bucket = bucketAndPathString.slice(0, firstSlashIndex);
//   const path = bucketAndPathString.slice(firstSlashIndex + 1);

//   const storage = getStorage();

//   const { data, error } = await storage.from(bucket).remove([path]);

//   return { data, error };
// };