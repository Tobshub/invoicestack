/*
  Warnings:

  - A unique constraint covering the columns `[txRef]` on the table `InvoicePayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InvoicePayment_txRef_key" ON "InvoicePayment"("txRef");
