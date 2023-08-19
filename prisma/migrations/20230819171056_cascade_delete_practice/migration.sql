-- DropForeignKey
ALTER TABLE "Practice" DROP CONSTRAINT "Practice_cardId_fkey";

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
