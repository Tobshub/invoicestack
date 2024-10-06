/*
  Warnings:

  - Changed the type of `status` on the `InvoicePayment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PAYMENTSTATUS" AS ENUM ('PENDING', 'SUCCESS', 'REFUNDED', 'FAILED');

-- AlterTable
ALTER TABLE "InvoicePayment" DROP COLUMN "status",
ADD COLUMN     "status" "PAYMENTSTATUS" NOT NULL;
