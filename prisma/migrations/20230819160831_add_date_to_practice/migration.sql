/*
  Warnings:

  - Added the required column `date` to the `Practice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "date" INTEGER NOT NULL;
