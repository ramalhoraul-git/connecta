// ============================================
// SUPABASE CONFIGURAÇÃO
// ============================================

// Configuração do Supabase
const SUPABASE_URL = 'https://spztajsribpyaittolnr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwenRhanNyaWJweWFpdHRvbG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NDI1MDgsImV4cCI6MjEwMTMxODUwOH0.a82tfOuttNg-LXJnPGfbmovqUGMUUfL8yDeMcr1EY8U';

// Cache local para fallback
let dadosCache = {
    artigos: null,
    depoimentos: null,
    ultimaAtualizacao: null
};

// ============================================
// FUNÇÕES DO SUPABASE
// ============================================

// Função para buscar artigos
async function buscarArtigos(filtros = {}) {
    try {
        const url = new URL(`${SUPABASE_URL}/rest/v1/artigos`);
        
        // Adiciona filtros
        if (filtros.status) {
            url.searchParams.append('status', `eq.${filtros.status}`);
        }
        if (filtros.destaque === true) {
            url.searchParams.append('destaque', 'eq.true');
        }
        if (filtros.categoria) {
            url.searchParams.append('categoria', `eq.${filtros.categoria}`);
        }
        if (filtros.limite) {
            url.searchParams.append('limit', filtros.limite);
        }
        
        // Ordenação
        url.searchParams.append('order', 'data.desc');
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar artigos: ${response.status}`);
        }
        
        const dados = await response.json();
        
        // Atualiza cache
        dadosCache.artigos = dados;
        dadosCache.ultimaAtualizacao = Date.now();
        
        return dados;
    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        // Fallback para dados locais se disponíveis
        if (dadosCache.artigos) {
            return dadosCache.artigos;
        }
        return getArtigosFallback();
    }
}

// Função para buscar um artigo específico
async function buscarArtigoPorId(id) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/artigos?id=eq.${id}`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar artigo: ${response.status}`);
        }
        
        const dados = await response.json();
        return dados[0] || null;
    } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        // Busca no cache ou fallback
        if (dadosCache.artigos) {
            return dadosCache.artigos.find(a => a.id == id) || null;
        }
        return null;
    }
}

// Função para buscar depoimentos
async function buscarDepoimentos() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/depoimentos?ativo=eq.true&order=data.desc`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar depoimentos: ${response.status}`);
        }
        
        const dados = await response.json();
        return dados;
    } catch (error) {
        console.error('Erro ao buscar depoimentos:', error);
        return getDepoimentosFallback();
    }
}

// Função para criar/atualizar artigo (admin)
async function salvarArtigo(artigo) {
    try {
        const isEdit = !!artigo.id;
        const url = `${SUPABASE_URL}/rest/v1/artigos${isEdit ? `?id=eq.${artigo.id}` : ''}`;
        
        const response = await fetch(url, {
            method: isEdit ? 'PATCH' : 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(artigo)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao salvar artigo: ${response.status}`);
        }
        
        const dados = await response.json();
        return dados[0] || dados;
    } catch (error) {
        console.error('Erro ao salvar artigo:', error);
        throw error;
    }
}

// Função para deletar artigo (admin)
async function deletarArtigo(id) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/artigos?id=eq.${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao deletar artigo: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao deletar artigo:', error);
        throw error;
    }
}

// Função de login (admin)
async function loginAdmin(email, senha) {
    try {
        const url = `${SUPABASE_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}`;
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário: ${response.status}`);
        }
        
        const usuarios = await response.json();
        const usuario = usuarios.find(u => u.senha === senha);
        
        if (!usuario) {
            throw new Error('Usuário ou senha inválidos');
        }
        
        return usuario;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
}

// ============================================
// DADOS FALLBACK (LOCALSTORAGE)
// ============================================

function getArtigosFallback() {
    const stored = localStorage.getItem('connecta_artigos');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {}
    }
    return [
        { id: 1, titulo: "Reforma Tributária: O que muda para sua empresa em 2025", resumo: "Entenda as principais mudanças na reforma tributária.", categoria: "Tributário", autor: "Erilma Silva", data: "2025-07-14", status: "Publicado", destaque: true },
        { id: 2, titulo: "MEI: Guia completo para não perder seu CNPJ", resumo: "Descubra os erros mais comuns que podem levar ao cancelamento do seu MEI.", categoria: "MEI", autor: "Erilma Silva", data: "2025-07-12", status: "Publicado", destaque: true }
    ];
}

function getDepoimentosFallback() {
    return [
        { id: 1, nome: "Raul Ramalho", empresa: "Vigorre • São Gonçalo/RJ", iniciais: "R", texto: "A Connecta entregam exatamente o que todo empreendedor precisa: transparência e segurança.", nota: 5, data: "2025-06-01", ativo: true },
        { id: 2, nome: "Daniele Aparecida", empresa: "Amovin • Rio Paranaíba/MG", iniciais: "D", texto: "O trabalho da Erilma vai muito além de cumprir obrigações.", nota: 5, data: "2025-05-01", ativo: true }
    ];
}

// ============================================
// EXPORTAR FUNÇÕES
// ============================================

// Disponibilizar globalmente
window.SupabaseAPI = {
    buscarArtigos,
    buscarArtigoPorId,
    buscarDepoimentos,
    salvarArtigo,
    deletarArtigo,
    loginAdmin,
    getArtigosFallback,
    getDepoimentosFallback
};

console.log('✅ Supabase API carregada!');
