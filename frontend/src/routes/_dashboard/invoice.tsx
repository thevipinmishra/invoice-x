import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/v4";
import { zodValidator } from "@tanstack/zod-adapter";
import { useQuery } from "@tanstack/react-query";
import { renderInvoice } from "@/services/invoice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const InvoiceSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/_dashboard/invoice")({
  component: RouteComponent,
  validateSearch: zodValidator(InvoiceSearchSchema),
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const invoiceQuery = useQuery({
    queryKey: ["invoice", search.id],
    queryFn: () => renderInvoice(search.id),
    enabled: !!search.id,
  });

  const convertPdfToImages = async (pdfData: Blob) => {
    try {
      setIsConverting(true);
      const arrayBuffer = await pdfData.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const images: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const imageUrl = canvas.toDataURL("image/png");
        images.push(imageUrl);
      }

      setImageUrls(images);
    } catch (error) {
      console.error("Error converting PDF to images:", error);
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    if (invoiceQuery.data) {
      const url = URL.createObjectURL(invoiceQuery.data);
      setPdfUrl(url);

      convertPdfToImages(invoiceQuery.data);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [invoiceQuery.data]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `invoice-${search.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const isLoading = invoiceQuery.isLoading || isConverting;
  const hasError = invoiceQuery.isError;
  const hasImages = imageUrls.length > 0;
  const hasData = !!invoiceQuery.data;

  return (
    <main className="min-h-screen w-full">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex gap-4 justify-between items-center max-w-7xl mx-auto">
          <Button variant="outline" onPress={() => navigate({ to: "/create" })}>
            <ArrowLeft /> Back to Create
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onPress={handleViewInNewTab}
              isDisabled={!pdfUrl || isLoading}
            >
              <ExternalLink /> View in New Tab
            </Button>
            <Button
              size="icon"
              onPress={handleDownload}
              aria-label="Download PDF"
              isDisabled={!pdfUrl || isLoading}
            >
              <Download />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full">
        {isLoading && (
          <div className="p-6 max-w-4xl mx-auto">
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {hasError && !isLoading && (
          <div className="p-6 max-w-4xl mx-auto">
            <Alert>
              <AlertTitle>Error loading invoice</AlertTitle>
            </Alert>
          </div>
        )}

        {hasImages && !isLoading && !hasError && (
          <div className="w-full">
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="w-full">
                {imageUrls.length > 1 && (
                  <div className="text-sm text-muted-foreground text-center py-2 bg-muted">
                    Page {index + 1} of {imageUrls.length}
                  </div>
                )}
                <div className="w-full flex justify-center bg-background">
                  <img
                    src={imageUrl}
                    alt={`Invoice page ${index + 1}`}
                    className="max-w-full h-auto block"
                    style={{ maxHeight: "calc(100vh - 80px)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasImages && !isLoading && !hasError && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {hasData ? "Processing invoice..." : "No invoice available"}
              </p>
              {hasData && (
                <div className="flex gap-2 justify-center">
                  <Button
                    onPress={handleViewInNewTab}
                    variant="outline"
                    isDisabled={!pdfUrl}
                  >
                    <ExternalLink /> View PDF in New Tab
                  </Button>
                  <Button onPress={handleDownload} isDisabled={!pdfUrl}>
                    <Download /> Download PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
