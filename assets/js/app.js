
document.addEventListener("DOMContentLoaded", () => {
    const tituloCapituloFixo = document.querySelector("#titulo-capitulo");
    const tituloMiolo = document.querySelector("#main-miolo article h1");
    const progressoRolagem = tituloCapituloFixo.querySelector(".progresso");
    const article = document.querySelector("#main-miolo article");

    let insetArticle = {
        top: (window.scrollY || window.pageYOffset) + article.getBoundingClientRect().top,
        bottom: (window.scrollY || window.pageYOffset) + article.getBoundingClientRect().bottom,
    }

    const getScrollData = () => {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return {
            percentage: (Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 10000)) / 100,
            scrollTop: h[st] || b[st]
        };
    }

    // metodo que atualiza a verdadeira largura da pagina, excluindo scrollbar, e o scroll maximo que a pagina pode ter.
    const attDimensoesPagina = () => {
        insetArticle = {
            top: (window.scrollY || window.pageYOffset) + article.getBoundingClientRect().top,
            bottom: (window.scrollY || window.pageYOffset) + article.getBoundingClientRect().bottom,
        }
        // maxScroll = document.documentElement.offsetHeight - window.innerHeight;
    }





    // ja atualiza logo de uma vez.
    attDimensoesPagina();

    // atualiza a cada 2 segundos.
    const constantUpdateDimensoes = setInterval(() => {
        attDimensoesPagina();

    }, 2000)

    // largura real atualiza com redimensao da tela.
    window.addEventListener("resizeend", attDimensoesPagina)


    // definição do evento resizeend, que dispara quando o usuario "termina" o redimensionamento da tela.
    const resizeend = new CustomEvent("resizeend");
    let resizeTimeout = setTimeout(() => { }, 0);
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            window.dispatchEvent(resizeend);
        }, 500)
    })

    // evento custom de "scrollend" (ja existe mas nao funciona em todo lugar), que dispara quando o usuário "termina" de rolar. Dispara quando o usuario fica pelo menos 1 segundo sem rolar após ter rolado alguma quantidade.
    const scrollend = new CustomEvent("scroll-ended");
    let scrollTimeout = setTimeout(() => { }, 0);
    document.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.dispatchEvent(scrollend);
        }, 1000)
    })



    // titulo recebe classe quando está sticky. Metodo meio porco mas tudo bem. Bem que podiam lançar um "evento" disso.
    document.addEventListener("scroll", e => {
        const currentScroll = (window.scrollY || window.pageYOffset);
        const tituloBottom = (window.scrollY || window.pageYOffset) + tituloMiolo.getBoundingClientRect().bottom;



        if (tituloCapituloFixo.classList.contains("ativo") && currentScroll < tituloBottom) {
            tituloCapituloFixo.classList.remove("ativo");
            document.documentElement.style.setProperty('--altura-header-titulo', "0px");

        }
        else if (!tituloCapituloFixo.classList.contains("ativo") && currentScroll > tituloBottom) {
            tituloCapituloFixo.classList.add("ativo");
            document.documentElement.style.setProperty('--altura-header-titulo', tituloCapituloFixo.getBoundingClientRect().height + "px");

        }
    })

    // metodo que gera as reguas de apoio, indicando onde o usuário "parou" a leitura.
    const criarReguaApoio = () => {
        const regua = document.createElement("div");
        regua.classList.add("regua-apoio", "sumiu");
        return regua;
    }
    // reguas geradas.
    const arrayReguas = [criarReguaApoio(), criarReguaApoio()];

    // reguas apendadas.
    document.body.append(...arrayReguas);

    // controlando onde a regua vai aparecer.
    document.addEventListener("scroll-ended", () => {
        const topsReguas = [
            Math.round((window.scrollY || window.pageYOffset) - 1),
            Math.round((window.scrollY || window.pageYOffset) + 1) + window.innerHeight
        ]

        if (topsReguas[0] > insetArticle.top) {
            arrayReguas[0].style.top = topsReguas[0] + "px";
            arrayReguas[0].classList.remove("sumiu");
        }
        if (topsReguas[1] < insetArticle.bottom) {
            arrayReguas[1].style.top = topsReguas[1] + "px";
            arrayReguas[1].classList.remove("sumiu");
        }
    })

    document.addEventListener("scroll", () => {
        if (!arrayReguas[0].classList.contains("sumiu")) {
            arrayReguas[0].classList.add("sumiu");
        }
        if (!arrayReguas[1].classList.contains("sumiu")) {
            arrayReguas[1].classList.add("sumiu");
        }
    })

    document.addEventListener("scroll", e => {
        // const scrollTop = window.scrollY || window.pageYOffset;
        // const percentageScroll = scrollTop/maxScroll;
        const percent = getScrollData().percentage;
        progressoRolagem.style.width = Math.min(percent, 100) + "%";

    })

    const main = document.querySelector("#main-miolo");
    const botoesNotas = document.querySelectorAll("#main-miolo article .botao-nota");
    const popoverNotas = document.querySelector("#notas-rodape");
    const notas = popoverNotas.querySelectorAll(".notas > div");
    const margemNota = parseFloat(getComputedStyle(document.documentElement).fontSize);
    console.log(margemNota);

    if (botoesNotas.length > 0){
        const fecharNota = e => {
            popoverNotas.classList.remove("surgiu", "apareceu", "bottom");
            popoverNotas.style.removeProperty("--originX");
            botoesNotas.forEach(bt => { bt.classList.remove("clicado") });
            podeFecharPopover = false;
            document.documentElement.removeEventListener("click", cliqueForaHandler);
        }
    
        const cliqueForaHandler = e => {
            if (!popoverNotas.contains(e.target) && e.target !== popoverNotas) {
                fecharNota();
            }
        }
    
        const abrirNota = (btClicado, idNotaAlvo) => {
            popoverNotas.classList.remove("surgiu", "apareceu", "bottom");
            const mainBcr = main.getBoundingClientRect();
            const btBcr = btClicado.getBoundingClientRect();
            const notaAlvo = popoverNotas.querySelector(idNotaAlvo);
            notas.forEach(nota => { nota.classList.remove("atual") })
            popoverNotas.classList.add("surgiu");
            notaAlvo.classList.add("atual");
            botoesNotas.forEach(bt => { bt.classList.remove("clicado") });
            btClicado.classList.add("clicado");
            const notasBcr = popoverNotas.getBoundingClientRect();
            let newTop = btBcr.top - notasBcr.height - 4;
            let newLeft = btBcr.left - notasBcr.width / 2 + btBcr.width / 2;
            if (newLeft < margemNota || newLeft > mainBcr.right - notasBcr.width - margemNota) {
                const wrongNewLeft = newLeft;
                if (newLeft < margemNota) { newLeft = margemNota; }
                else { newLeft = mainBcr.right - notasBcr.width - margemNota }
                const diferencaLefts = newLeft - wrongNewLeft;
                const newOriginX = 50 - 100 * (diferencaLefts / notasBcr.width);
                popoverNotas.style.setProperty("--originX", newOriginX + "%");
            }
    
            if (newTop < mainBcr.top) {
                popoverNotas.classList.add("bottom");
                newTop = btBcr.bottom + 4;
            }
            newTop = newTop - mainBcr.top;
            popoverNotas.style.top = newTop + "px";
            popoverNotas.style.left = newLeft + "px";
            popoverNotas.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest"
            });
            popoverNotas.classList.add("apareceu");
            document.documentElement.addEventListener("click", cliqueForaHandler)
        }
    
        botoesNotas.forEach(bt => {
            bt.addEventListener("click", e => {
                e.stopPropagation();
                const idNotaAlvo = "#" + bt.getAttribute("data-for");
                abrirNota(bt, idNotaAlvo);
            })
        })
    
        popoverNotas.querySelector(".fechar-nota").addEventListener("click", fecharNota);
    }





    const tabelas = document.querySelectorAll("#main-miolo article table");
    if (tabelas.length > 0){
        tabelas.forEach(tabela => {
            const paiTabela = tabela.parentElement;
            console.log(paiTabela);
            if (!paiTabela.classList.contains("container-table")) {
                const wrapper = document.createElement("div");
                wrapper.classList.add("container-table");
                paiTabela.insertBefore(wrapper, tabela);
                wrapper.appendChild(tabela);
            }
        })
    }


    const anchorTags = document.querySelectorAll("#main-miolo article a");
    if (anchorTags.length > 0) {
        anchorTags.forEach(a => {
            const aText = a.innerText.trim();
            if (aText.startsWith("http")) {
                a.classList.add("text-is-url");
            }
        })
    }


    const iframesYoutube = document.querySelectorAll("#main-miolo article iframe[src*='youtube']");
    if (iframesYoutube.length > 0){
        const altIframeTemplate = document.createElement("div");
        const pAlt = document.createElement("p");
        const aYt = document.createElement("a");
        altIframeTemplate.classList.add("alt-iframe");
        aYt.innerText = "vídeo no YouTube";
        aYt.setAttribute("target", "_blank");
        pAlt.append("Assista ao ");
        pAlt.append(aYt);
        pAlt.append(".");

        altIframeTemplate.append(pAlt);
        iframesYoutube.forEach(ifyt=>{
            const altClone = altIframeTemplate.cloneNode(true);
            const ytEmbedUrl = ifyt.getAttribute("src");
            const canonicalUrl = ytEmbedUrl.replace("/embed/", "/watch?v=");
            altClone.querySelector("a").setAttribute("href", canonicalUrl);
            ifyt.after(altClone);
        })
    }
})