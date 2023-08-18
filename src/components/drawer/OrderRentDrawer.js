import DrawerButton from "components/form/DrawerButton";
import Error from "components/form/Error";
import InputArea from "components/form/InputArea";
import LabelArea from "components/form/LabelArea";
import Title from "components/form/Title";
import useOrderRentSubmit from "hooks/useOrderRentSubmit";
import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";

const OrderRentDrawer = ({ id }) => {
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
    } = useOrderRentSubmit(id);

    return (
        <>
            <div className="w-full relative  p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 ">
                {id ? (
                    <Title
                        title={t("UpdateListRent")}
                        description={t("UpdateListRentText")}
                    />
                ) : (
                    <Title title={t("AddShipping")} description={t("AddShippingText")} />
                )}
            </div>

            <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                            <LabelArea label={t("BillOfLadingCode")} />
                            <div className="col-span-8 sm:col-span-4">
                                <InputArea
                                    register={register}
                                    label="BillOfLadingCode"
                                    name="BillOfLadingCode"
                                    type="text"
                                    placeholder={t("BillOfLadingCode")}
                                />
                                <Error errorName={errors.BillOfLadingCode} />
                            </div>
                        </div>
                    </div>

                    <DrawerButton id={id} title="Rent" isSubmitting={isSubmitting} />
                </form>
            </Scrollbars>
        </>
    );
};

export default OrderRentDrawer;
