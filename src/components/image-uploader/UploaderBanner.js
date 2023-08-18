import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import cloudinary from "cloudinary/lib/cloudinary";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

//internal import
import useAsync from "hooks/useAsync";
import SettingServices from "services/SettingServices";
import { notifyError, notifySuccess } from "../../utils/toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ContainerBanner from "./ContainerBanner";

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const UploaderBanner = ({
  setImageBannerUrl,
  imageBannerUrl,
  banner,
  folder,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");

  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);

  // console.log("data", data);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: "image/*",
    multiple: banner ? true : false,
    maxSize: 5000000,
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (fileRejections) {
      fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>
                {e.code === "too-many-files"
                  ? notifyError(
                      `Tối đa ${globalSetting?.number_of_image_per_product} kích thước ảnh có thể upload!`
                    )
                  : notifyError(e.message)}
              </li>
            ))}
          </ul>
        </li>
      ));
    }

    if (files) {
      files.forEach((file) => {
        if (
          banner &&
          imageBannerUrl?.length + files?.length >
            globalSetting?.number_of_image_per_product
        ) {
          return notifyError(
            `Tối đa ${globalSetting?.number_of_image_per_product} kích thước ảnh có thể upload!`
          );
        }

        setLoading(true);
        setError("Uploading....");

        if (banner) {
          const result = imageBannerUrl?.find(
            (img) => img === `${process.env.REACT_APP_CLOUDINARY_URL}`
          );

          if (result) return setLoading(false);
        }

        const name = file.name.replaceAll(/\s/g, "");
        const public_id = name.substring(0, name.lastIndexOf("."));

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
        formData.append("folder", folder);
        formData.append("public_id", public_id);

        axios({
          url: process.env.REACT_APP_CLOUDINARY_URL,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData,
        })
          .then((res) => {
            notifySuccess("Upload ảnh thành công!");
            setLoading(false);
            if (banner) {
              setImageBannerUrl((imgUrl) => [...imgUrl, res.data.secure_url]);
            } else {
              setImageBannerUrl(res.data.secure_url);
            }
          })
          .catch((err) => {
            notifyError("Upload ảnh không thành công!");
            setLoading(false);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    try {
      // const url = img.substring(img.length - 25);
      const url = img.split("/").pop().split(".")[0];
      const public_id = `${folder}/${url}`;

      const res = await cloudinary.v2.uploader.destroy(public_id);

      setLoading(false);
      notifySuccess(res.result === "ok" ? "Xóa ảnh thành công!" : res.result);
      if (banner) {
        const result = imageBannerUrl?.filter((i) => i !== img);
        setImageBannerUrl(result);
      } else {
        setImageBannerUrl("");
      }
    } catch (err) {
      notifyError("Xóa ảnh thất bại!");
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-blue-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">{t("imageFormat")}</em>
      </div>

      <div className="text-blue-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {banner ? (
          <DndProvider backend={HTML5Backend}>
            <ContainerBanner
              setImageBannerUrl={setImageBannerUrl}
              imageBannerUrl={imageBannerUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !banner && imageBannerUrl ? (
          <div className="relative">
            {" "}
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageBannerUrl}
              alt="banner"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageBannerUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default UploaderBanner;
