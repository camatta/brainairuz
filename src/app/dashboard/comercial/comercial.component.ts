import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-comercial',
  templateUrl: './comercial.component.html',
  styleUrls: ['./comercial.component.css']
})

export class ComercialComponent {
  @ViewChild('canvas') canvas!: ElementRef;
  nomeCliente: string = '';
  avisoProjeto: string = '';
  tipoProjeto: string = '';
  logoFile: File | undefined; 

  criarImagemPersonalizada() {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;

    canvas.width = 1080;
    canvas.height = 1080;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Não foi possível obter o contexto do canvas.');
    }

    const imgFundo = new Image();
    imgFundo.src = '../../../assets/images/bg-projetos.png';
  
    imgFundo.onload = () => {
      const xFundo = (canvas.width - imgFundo.width) / 2;
      const yFundo = (canvas.height - imgFundo.height) / 2;
      ctx.drawImage(imgFundo, xFundo, yFundo, imgFundo.width, imgFundo.height);
  
      ctx.font = '26px Poppins';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center'; 
      
  
      const xTexto = canvas.width / 2;
      const yNomeCliente = 420;
      const yTipoProjeto = 950;
      const yAvisoProjeto = 300;

      ctx.font = 'italic 800 80px Poppins'; 
      ctx.fillStyle = '#00ddaa';
      ctx.fillText(this.nomeCliente, xTexto, yNomeCliente);

      ctx.font = '26px Poppins';
      ctx.fillStyle = 'white';
      ctx.fillText(this.tipoProjeto, xTexto, yTipoProjeto);

      ctx.font = '26px Poppins';
      ctx.fillStyle = 'white';
      ctx.fillText(this.avisoProjeto, xTexto, yAvisoProjeto);
  
      if (this.logoFile) {
        const maxLogoWidth = 280;
  
        const logoImg = new Image();
        logoImg.src = URL.createObjectURL(this.logoFile);
  
        logoImg.onload = () => {
          let logoWidth = logoImg.width;
          let logoHeight = logoImg.height;
  
          if (logoWidth > maxLogoWidth) {

            const scaleFactor = maxLogoWidth / logoWidth;
            logoWidth *= scaleFactor;
            logoHeight *= scaleFactor;
          }
  
          const xLogo = (canvas.width - logoWidth) / 2;
          const yLogo = 665;
          ctx.drawImage(logoImg, xLogo, yLogo, logoWidth, logoHeight);
  
          const imagemPersonalizada = canvas.toDataURL('image/jpeg', 0.9);
  
          const link = document.createElement('a');
          link.href = imagemPersonalizada;
          link.download = 'novo_projeto.jpg';
          link.click();
        };
      }
    };
    
  }

  onFileSelected(event: any) {
    this.logoFile = event.target.files[0];
  }
}
