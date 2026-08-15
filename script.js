document.addEventListener("DOMContentLoaded", () => {

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       MENU MOBILE
    ====================================================== */

    const botaoMenu =
        document.querySelector(".botao-menu");

    const menu =
        document.querySelector(".menu-principal");


    function fecharMenu() {

        if (!botaoMenu || !menu) {
            return;
        }

        menu.classList.remove("aberto");

        botaoMenu.classList.remove("aberto");

        botaoMenu.setAttribute(
            "aria-expanded",
            "false"
        );

        botaoMenu.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }


    if (botaoMenu && menu) {

        botaoMenu.addEventListener(
            "click",
            (evento) => {

                evento.stopPropagation();

                const aberto =
                    menu.classList.toggle(
                        "aberto"
                    );

                botaoMenu.classList.toggle(
                    "aberto",
                    aberto
                );

                botaoMenu.setAttribute(
                    "aria-expanded",
                    aberto
                        ? "true"
                        : "false"
                );

                botaoMenu.setAttribute(
                    "aria-label",
                    aberto
                        ? "Fechar menu"
                        : "Abrir menu"
                );

            }
        );


        menu.querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    fecharMenu
                );

            });


        document.addEventListener(
            "click",
            (evento) => {

                if (
                    !menu.classList.contains(
                        "aberto"
                    )
                ) {
                    return;
                }

                if (
                    menu.contains(evento.target) ||
                    botaoMenu.contains(
                        evento.target
                    )
                ) {
                    return;
                }

                fecharMenu();

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 1120
                ) {
                    fecharMenu();
                }

            }
        );

    }


    /* =====================================================
       ANIMAÇÕES AO ROLAR
    ====================================================== */

    const elementosReveal =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        reduzirMovimento ||
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elementosReveal.forEach(
            (elemento) => {

                elemento.classList.add(
                    "visivel"
                );

            }
        );

    } else {

        const revealObserver =
            new IntersectionObserver(
                (entradas, observer) => {

                    entradas.forEach(
                        (entrada) => {

                            if (
                                entrada.isIntersecting
                            ) {

                                entrada.target
                                    .classList.add(
                                        "visivel"
                                    );

                                observer.unobserve(
                                    entrada.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        elementosReveal.forEach(
            (elemento) => {

                revealObserver.observe(
                    elemento
                );

            }
        );

    }


    /* =====================================================
       VOLTAR AO TOPO
    ====================================================== */

    const voltarTopo =
        document.querySelector(
            ".voltar-topo"
        );


    if (voltarTopo) {

        const atualizarBotaoTopo =
            () => {

                voltarTopo.classList.toggle(
                    "visivel",
                    window.scrollY > 600
                );

            };


        window.addEventListener(
            "scroll",
            atualizarBotaoTopo,
            {
                passive: true
            }
        );


        atualizarBotaoTopo();


        voltarTopo.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior:
                        reduzirMovimento
                            ? "auto"
                            : "smooth"
                });

            }
        );

    }


    /* =====================================================
       DESTACA A SEÇÃO ATUAL NO MENU
    ====================================================== */

    const linksMenu =
        Array.from(
            document.querySelectorAll(
                '.menu-principal a[href^="#"]'
            )
        );


    const secoes =
        linksMenu
            .map((link) => {

                const seletor =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !seletor ||
                    seletor === "#"
                ) {
                    return null;
                }

                return document
                    .querySelector(
                        seletor
                    );

            })
            .filter(Boolean);


    function marcarLinkAtivo(id) {

        linksMenu.forEach(
            (link) => {

                const ativo =
                    link.getAttribute(
                        "href"
                    ) === `#${id}`;

                link.classList.toggle(
                    "ativo",
                    ativo
                );

                if (ativo) {

                    link.setAttribute(
                        "aria-current",
                        "location"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );

    }


    if (
        "IntersectionObserver"
        in window &&
        secoes.length
    ) {

        const secaoObserver =
            new IntersectionObserver(
                (entradas) => {

                    const visiveis =
                        entradas
                            .filter(
                                (entrada) =>
                                    entrada
                                        .isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );


                    if (!visiveis.length) {
                        return;
                    }


                    marcarLinkAtivo(
                        visiveis[0]
                            .target
                            .id
                    );

                },
                {
                    rootMargin:
                        "-22% 0px -62% 0px",

                    threshold:
                        [0, 0.1, 0.25, 0.5]
                }
            );


        secoes.forEach(
            (secao) => {

                secaoObserver.observe(
                    secao
                );

            }
        );

    }


    /* =====================================================
       LIGHTBOX DA GALERIA
    ====================================================== */

    const lightbox =
        document.querySelector(
            ".lightbox"
        );

    const lightboxImagem =
        lightbox?.querySelector(
            ".lightbox-conteudo img"
        );

    const lightboxLegenda =
        lightbox?.querySelector(
            ".lightbox-conteudo figcaption"
        );

    const botaoFechar =
        lightbox?.querySelector(
            ".lightbox-fechar"
        );

    const botaoAnterior =
        lightbox?.querySelector(
            ".lightbox-anterior"
        );

    const botaoProxima =
        lightbox?.querySelector(
            ".lightbox-proxima"
        );

    const imagens =
        Array.from(
            document.querySelectorAll(
                ".lightbox-trigger"
            )
        );


    let indiceAtual = 0;

    let elementoAnteriorAoLightbox =
        null;


    function mostrarImagem(indice) {

        if (
            !imagens.length ||
            !lightboxImagem
        ) {
            return;
        }


        indiceAtual =
            (
                indice +
                imagens.length
            ) %
            imagens.length;


        const botao =
            imagens[indiceAtual];


        const src =
            botao.dataset
                .lightboxSrc;


        const alt =
            botao.dataset
                .lightboxAlt ||
            "Imagem ampliada da Orquestra Volpi";


        lightboxImagem.src =
            src;

        lightboxImagem.alt =
            alt;


        if (lightboxLegenda) {

            lightboxLegenda.textContent =
                alt;

        }

    }


    function abrirLightbox(indice) {

        if (!lightbox) {
            return;
        }


        elementoAnteriorAoLightbox =
            document.activeElement;


        mostrarImagem(indice);


        lightbox.classList.add(
            "aberto"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body
            .classList.add(
                "lightbox-aberto"
            );


        botaoFechar?.focus();

    }


    function fecharLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "aberto"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body
            .classList.remove(
                "lightbox-aberto"
            );


        if (lightboxImagem) {

            lightboxImagem
                .removeAttribute(
                    "src"
                );

        }


        if (
            elementoAnteriorAoLightbox
            instanceof HTMLElement
        ) {

            elementoAnteriorAoLightbox
                .focus();

        }

    }


    function elementosFocaveisLightbox() {

        if (!lightbox) {
            return [];
        }

        return Array.from(
            lightbox.querySelectorAll(
                'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            )
        );

    }


    imagens.forEach(
        (botao, indice) => {

            botao.addEventListener(
                "click",
                () => {

                    abrirLightbox(
                        indice
                    );

                }
            );

        }
    );


    botaoFechar?.addEventListener(
        "click",
        fecharLightbox
    );


    botaoAnterior?.addEventListener(
        "click",
        () => {

            mostrarImagem(
                indiceAtual - 1
            );

        }
    );


    botaoProxima?.addEventListener(
        "click",
        () => {

            mostrarImagem(
                indiceAtual + 1
            );

        }
    );


    lightbox?.addEventListener(
        "click",
        (evento) => {

            if (
                evento.target ===
                lightbox
            ) {

                fecharLightbox();

            }

        }
    );


    /* =====================================================
       COMPARTILHAR SITE
    ====================================================== */

    const botaoCompartilhar =
        document.querySelector(
            ".botao-compartilhar"
        );

    const mensagemCompartilhar =
        document.querySelector(
            ".mensagem-compartilhar"
        );


    async function copiarLink() {

        const url =
            "https://orquestravolpi.com.br/";


        try {

            await navigator.clipboard
                .writeText(url);

            if (
                mensagemCompartilhar
            ) {

                mensagemCompartilhar
                    .textContent =
                    "Link copiado!";

            }

        } catch {

            const campo =
                document.createElement(
                    "textarea"
                );

            campo.value = url;

            campo.setAttribute(
                "readonly",
                ""
            );

            campo.style.position =
                "fixed";

            campo.style.opacity =
                "0";

            document.body
                .appendChild(campo);

            campo.select();

            document.execCommand(
                "copy"
            );

            campo.remove();


            if (
                mensagemCompartilhar
            ) {

                mensagemCompartilhar
                    .textContent =
                    "Link copiado!";

            }

        }

    }


    if (botaoCompartilhar) {

        botaoCompartilhar
            .addEventListener(
                "click",
                async () => {

                    const dados = {
                        title:
                            "Orquestra Volpi de Viola Caipira",

                        text:
                            "Conheça a Orquestra Volpi de Viola Caipira.",

                        url:
                            "https://orquestravolpi.com.br/"
                    };


                    if (
                        navigator.share
                    ) {

                        try {

                            await navigator
                                .share(dados);

                        } catch (erro) {

                            if (
                                erro.name !==
                                "AbortError"
                            ) {

                                await copiarLink();

                            }

                        }

                    } else {

                        await copiarLink();

                    }

                }
            );

    }


    /* =====================================================
       TECLADO
    ====================================================== */

    document.addEventListener(
        "keydown",
        (evento) => {

            /* ESC fecha menu */

            if (
                evento.key ===
                "Escape"
            ) {

                if (
                    menu?.classList
                        .contains(
                            "aberto"
                        )
                ) {

                    fecharMenu();

                    botaoMenu?.focus();

                }

            }


            /* atalhos do lightbox */

            if (
                !lightbox ||
                !lightbox.classList
                    .contains(
                        "aberto"
                    )
            ) {
                return;
            }


            if (
                evento.key ===
                "Escape"
            ) {

                evento.preventDefault();

                fecharLightbox();

                return;

            }


            if (
                evento.key ===
                "ArrowLeft"
            ) {

                evento.preventDefault();

                mostrarImagem(
                    indiceAtual - 1
                );

                return;

            }


            if (
                evento.key ===
                "ArrowRight"
            ) {

                evento.preventDefault();

                mostrarImagem(
                    indiceAtual + 1
                );

                return;

            }


            /* mantém TAB dentro do lightbox */

            if (
                evento.key ===
                "Tab"
            ) {

                const focaveis =
                    elementosFocaveisLightbox();


                if (!focaveis.length) {
                    return;
                }


                const primeiro =
                    focaveis[0];

                const ultimo =
                    focaveis[
                        focaveis.length -
                        1
                    ];


                if (
                    evento.shiftKey &&
                    document.activeElement ===
                        primeiro
                ) {

                    evento.preventDefault();

                    ultimo.focus();

                } else if (
                    !evento.shiftKey &&
                    document.activeElement ===
                        ultimo
                ) {

                    evento.preventDefault();

                    primeiro.focus();

                }

            }

        }
    );

});
