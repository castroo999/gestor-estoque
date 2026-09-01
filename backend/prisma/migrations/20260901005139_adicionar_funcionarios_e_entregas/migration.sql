-- CreateEnum
CREATE TYPE "TipoProduto" AS ENUM ('COMUM', 'EPI', 'FERRAMENTA', 'EQUIPAMENTO', 'UNIFORME');

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "ca" TEXT,
ADD COLUMN     "estoqueMinimo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fabricante" TEXT,
ADD COLUMN     "lote" TEXT,
ADD COLUMN     "tamanho" TEXT,
ADD COLUMN     "tipo" "TipoProduto" NOT NULL DEFAULT 'COMUM',
ADD COLUMN     "validadeCA" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "matricula" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregaProduto" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "entregueEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "devolvidoEm" TIMESTAMP(3),
    "observacao" TEXT,
    "funcionarioId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,

    CONSTRAINT "EntregaProduto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Funcionario_userId_idx" ON "Funcionario"("userId");

-- CreateIndex
CREATE INDEX "Funcionario_setor_idx" ON "Funcionario"("setor");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_userId_matricula_key" ON "Funcionario"("userId", "matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_userId_cpf_key" ON "Funcionario"("userId", "cpf");

-- CreateIndex
CREATE INDEX "EntregaProduto_funcionarioId_idx" ON "EntregaProduto"("funcionarioId");

-- CreateIndex
CREATE INDEX "EntregaProduto_produtoId_idx" ON "EntregaProduto"("produtoId");

-- CreateIndex
CREATE INDEX "EntregaProduto_responsavelId_idx" ON "EntregaProduto"("responsavelId");

-- CreateIndex
CREATE INDEX "EntregaProduto_entregueEm_idx" ON "EntregaProduto"("entregueEm");

-- CreateIndex
CREATE INDEX "Produto_userId_idx" ON "Produto"("userId");

-- CreateIndex
CREATE INDEX "Produto_tipo_idx" ON "Produto"("tipo");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaProduto" ADD CONSTRAINT "EntregaProduto_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaProduto" ADD CONSTRAINT "EntregaProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaProduto" ADD CONSTRAINT "EntregaProduto_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
