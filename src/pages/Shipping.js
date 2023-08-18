import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
import { useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import PageTitle from "components/Typography/PageTitle";
import ShippingServices from "services/ShippingServices";
import TableLoading from "components/preloader/TableLoading";
import ShippingTable from "components/shipping/ShippingTable";
import NotFound from "components/table/NotFound";

const Shipping = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const { data, loading } = useAsync(ShippingServices.getAllShipping);
  // console.log('data',data)
  const [isCheck, setIsCheck] = useState([]);
  const { t } = useTranslation();

  const {
    handleSubmitShipping,
    shippingRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
  } = useFilter(data);

  return (
    <>
      <PageTitle>{t("Shipping")}</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitShipping}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6  xl:flex"
          >
            <div className="flex justify-start xl:w-1/2  md:w-full">
              {/* <UploadManyTwo
                                title="Coupon"
                                exportData={data}
                                filename={filename}
                                isDisabled={isDisabled}
                                handleSelectFile={handleSelectFile}
                                handleUploadMultiple={handleUploadMultiple}
                                handleRemoveSelectFile={handleRemoveSelectFile}
                            /> */}
            </div>

            <div className="lg:flex  md:flex xl:justify-end xl:w-1/2  md:w-full md:justify-start flex-grow-0">
              <div className="w-full md:w-48 lg:w-48 xl:w-48">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("AddShipping")}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitShipping}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={shippingRef}
                type="search"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                placeholder={t("SearchByShippingName")}
              />
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={8} width={140} height={20} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>STT</TableCell>
                <TableCell>{t("Image")}</TableCell>
                <TableCell>{t("NameTbl")}</TableCell>
                <TableCell>{t("ShippingCost")}</TableCell>
                <TableCell>{t("Notes")}</TableCell>
                <TableCell className="text-right">
                  {t("CoupTblActions")}
                </TableCell>
              </tr>
            </TableHeader>
            <ShippingTable
              lang={lang}
              isCheck={isCheck}
              shippings={dataTable}
              setIsCheck={setIsCheck}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label= {t("TableNavigation")}
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title={t("SorryBlogNotFound")} />
      )}
    </>
  );
};

export default Shipping;
