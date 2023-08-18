import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import InputValue from "components/form/InputValue";
import LabelArea from "components/form/LabelArea";
import Title from "components/form/Title";
import Uploader from "components/image-uploader/Uploader";
import EditorNotImage from "components/quill/EditorNotImage";
import useShippingSubmit from "hooks/useShippingSubmit";
import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";
const ShippingDrawer = ({ id }) => {
  const {
    content,
    setContent,
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    isSubmitting,
    setCosts,
  } = useShippingSubmit(id);
  return (
    <>
      <div className="w-full relative  p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 ">
        {id ? (
          <Title
            title={t("UpdateShipping")}
            description={t("UpdateShippingText")}
          />
        ) : (
          <Title title={t("AddShipping")} description={t("AddShippingText")} />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("ShippingName")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Shipping name"
                  name="transportunitname"
                  type="text"
                  placeholder={t("Title")}
                />
                <Error errorName={errors.transportunitname} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("CarrierLogo")} />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="shipping"
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("ShippingCost")} />
              <div className="col-span-8 sm:col-span-4">
                <InputValue
                  register={register}
                  name="costs"
                  setCosts={setCosts}
                  placeholder={t("ShippingCost")}
                />
                <Error errorName={errors.costs} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("ShippingDescription")} />
              <div className="col-span-8 sm:col-span-4">
                <EditorNotImage
                  content={content}
                  setContent={setContent}
                  placeholder={t("ShippingDescription")}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Shipping" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default ShippingDrawer;
