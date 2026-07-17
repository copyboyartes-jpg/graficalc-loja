# Versao online privada

Esta pasta prepara o app atual para a hospedagem privada e agora separa a geracao do commit final da etapa de envio.

Arquivos principais:

- `build-private-site.ps1`
- `publicar-site-privado.ps1`
- `publicar-site-privado.cmd`
- `.openai/hosting.json`
- `COMO-PUBLICAR.txt`

Fluxo normal:

1. Executar `publicar-site-privado.cmd`
2. Ler o commit final em `resultado-publicacao.txt`
3. Enviar esse commit ao Codex para concluir a publicacao online

O pacote gerado continua ficando em `online-private-site/dist/`.
