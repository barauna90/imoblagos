import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Budget, BudgetInstallment } from '../types/bkaap';

export const calculateInstallments = (
  valorTotal: number,
  valorEntrada: number,
  numeroParcelas: number,
  dataPrimeiraParcela: string,
  correcaoTipo: 'INCC' | 'IPCA' | 'Taxa Fixa',
  correcaoPercentual: number = 0
): BudgetInstallment[] => {
  const valorFinanciado = valorTotal - valorEntrada;
  const valorParcelaBase = valorFinanciado / numeroParcelas;
  const installments: BudgetInstallment[] = [];
  
  const dataInicial = new Date(dataPrimeiraParcela);
  
  for (let i = 0; i < numeroParcelas; i++) {
    const dataVencimento = new Date(dataInicial);
    dataVencimento.setMonth(dataVencimento.getMonth() + i);
    
    // Calculate correction (simplified - in real scenario, you'd fetch actual INCC/IPCA rates)
    const anosDecorridos = i / 12;
    const correcaoAplicada = correcaoPercentual * anosDecorridos;
    const valorCorrigido = valorParcelaBase * (1 + correcaoAplicada / 100);
    
    installments.push({
      numero: i + 1,
      data_vencimento: dataVencimento.toISOString().split('T')[0],
      valor_original: valorParcelaBase,
      valor_corrigido: valorCorrigido,
      correcao_aplicada: correcaoAplicada
    });
  }
  
  return installments;
};

export const generateBudgetPDF = (budget: Budget, installments: BudgetInstallment[]) => {
  const doc = new jsPDF();
  
  // Add watermark
  doc.setFontSize(60);
  doc.setTextColor(200, 200, 200);
  doc.text('BKAAP', 105, 150, { align: 'center', angle: 45 });
  
  // Reset color for content
  doc.setTextColor(0, 0, 0);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BKAAP CONSTRUÇÕES', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Orçamento de Obra', 105, 28, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);
  
  // Client Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente', 14, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${budget.cliente_nome}`, 14, 58);
  if (budget.cliente_email) {
    doc.text(`Email: ${budget.cliente_email}`, 14, 64);
  }
  if (budget.cliente_telefone) {
    doc.text(`Telefone: ${budget.cliente_telefone}`, 14, 70);
  }
  
  // Budget Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhes do Orçamento', 14, 82);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let yPos = 90;
  
  doc.text(`Custo por m² (com material): R$ ${budget.custo_m2_com_material.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPos);
  yPos += 6;
  doc.text(`Custo por m² (sem material): R$ ${budget.custo_m2_sem_material.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPos);
  yPos += 6;
  doc.text(`Metragem Total: ${budget.metragem_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} m²`, 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Valor Total à Vista: R$ ${budget.valor_total_vista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPos);
  yPos += 6;
  doc.text(`Valor de Entrada: R$ ${budget.valor_entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPos);
  yPos += 6;
  doc.text(`Valor Total Parcelado: R$ ${budget.valor_total_parcelado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Número de Parcelas: ${budget.numero_parcelas}x`, 14, yPos);
  yPos += 6;
  doc.text(`Correção: ${budget.correcao_tipo}${budget.correcao_percentual ? ` (${budget.correcao_percentual}% a.a.)` : ''}`, 14, yPos);
  yPos += 6;
  doc.text(`Data da Primeira Parcela: ${new Date(budget.data_primeira_parcela).toLocaleDateString('pt-BR')}`, 14, yPos);
  
  // Installments Table
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cronograma de Parcelas', 14, yPos);
  
  yPos += 5;
  
  const tableData = installments.map(inst => [
    inst.numero.toString(),
    new Date(inst.data_vencimento).toLocaleDateString('pt-BR'),
    `R$ ${inst.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${inst.valor_corrigido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `${inst.correcao_aplicada.toFixed(2)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Nº', 'Vencimento', 'Valor Base', 'Valor Corrigido', 'Correção']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25 }
    }
  });
  
  // Observations
  if (budget.observacoes) {
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações Contratuais', 14, finalY + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(budget.observacoes, 180);
    doc.text(splitText, 14, finalY + 18);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'BKAAP Construções - diretoria@bkaap.com.br',
      105,
      285,
      { align: 'center' }
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }
  
  return doc;
};
