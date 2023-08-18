import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import MainDrawer from "components/drawer/MainDrawer";
import OrderRentDrawer from "components/drawer/OrderRentDrawer";
import PrintReceipt from "components/form/PrintReceipt";
import SelectPaymentStatus from "components/form/SelectPaymentStatus";
import SelectStatus from "components/form/SelectStatus";
import EditButton from "components/table/EditButton";
import Status from "components/table/Status";
import Tooltip from "components/tooltip/Tooltip";
import useToggleDrawer from "hooks/useToggleDrawer";
import { useTranslation } from "react-i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { showDateTimeFormat } from "utils/dateFormate";

const OrderTable = ({ orders, currency, globalSetting }) => {
  // console.log('globalSetting',globalSetting)
  const { t } = useTranslation();
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainDrawer>
        <OrderRentDrawer id={serviceId} />
      </MainDrawer>
      <TableBody className="dark:bg-gray-900">
        {orders?.map((order, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?.invoice}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {showDateTimeFormat(
                  order?.createdAt,
                  globalSetting?.default_date_format,
                  ""
                )}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <span className="text-sm">{(order?.user_info?.name).slice(0, 20)}...</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {t(order?.paymentMethod)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold ">
                {order.BillOfLadingCode ? <p className="text-blue-500">{(order?.BillOfLadingCode).slice(0, 10)}</p> : <p className="text-orange-400">Chưa nhập</p>}
              </span>
            </TableCell>
            <TableCell>
              <Status status={order?.statusPayment} />
            </TableCell>

            <TableCell className="text-center">
              <SelectPaymentStatus id={order._id} order={order} />
            </TableCell>
            <TableCell className="text-xs">
              <Status status={order?.status} />
            </TableCell>

            <TableCell className="text-center">
              <SelectStatus id={order._id} order={order} />
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <div className="flex justify-between items-center">
                <EditButton
                  id={order?._id}
                  handleUpdate={handleUpdate}
                />
                <PrintReceipt orderId={order._id} />

                <span className="p-2 cursor-pointer text-gray-400 hover:text-blue-600">
                  <Link to={`/order/${order._id}`}>
                    <Tooltip
                      id="view"
                      Icon={FiZoomIn}
                      title={t("ViewInvoice")}
                      bgColor="blue"
                    />
                  </Link>
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrderTable;
