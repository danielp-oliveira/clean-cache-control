# Gravar Compras no Cache

> ## Caso de sucesso

1. Sistema executa o comando "Salvar Compras"
2. Sistema cria uma data para ser armazenada no Cache
3. OK Sistema apaga os dados do Cache atual
4. Sistema grava os novos dados do Cache
5. Sistema não retorna nenhum erro

> ## Exceção - Erro ao apagar dados do Cache

1. OK Sistema não grava os novos dados do Cache
2. OK Sistema retorna erro

> ## Exceção - Erro ao gravar dados do Cache

1. Sistema retorna erro
