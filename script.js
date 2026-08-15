document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENU MOBILE
    ====================================================== */

    const botaoMenu = document.querySelector(".botao-menu");
    const menu = document.querySelector(".menu-principal");

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", () => {
            const aberto = menu.classList.toggle("aberto");

            botaoMenu.classList.toggle("aberto", aberto);

            botaoMenu.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );

            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
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
            });
        });
    }


    /* =====================================================
       ANIMAÇÕES SUAVES AO ROLAR
    ====================================================== */

    const elementosReveal =
        document.querySelectorAll(".reveal");

    const reduzirMovimento =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        reduzirMovimento ||
        !("IntersectionObserver" in window)
    ) {
        elementosReveal.forEach((elemento) => {
            elemento.classList.add("visivel");
        });
    } else {

        const revealObserver =
            new IntersectionObserver(
                (entradas, observer) => {

                    entradas.forEach((entrada) => {

                        if (entrada.isIntersecting) {

                            entrada.target.classList.add(
                                "visivel"
                            );

                            observer.unobserve(
                                entrada.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );

        elementosReveal.forEach((elemento) => {
            revealObserver.observe(elemento);
        });
    }


    /* =====================================================
       BOTÃO VOLTAR AO TOPO
    ====================================================== */

    const voltarTopo =
        document.querySelector(".voltar-topo");

    if (voltarTopo) {

        const atualizarBotaoTopo = () => {

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
       MENU DESTACA A SEÇÃO ATUAL
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
                    link.getAttribute("href");

                if (
                    !seletor ||
                    seletor === "#"
                ) {
                    return null;
                }

                return document.querySelector(
                    seletor
                );

            })
            .filter(Boolean);


    if (
        "IntersectionObserver" in window &&
        secoes.length
    ) {

        const secaoObserver =
            new IntersectionObserver(
                (entradas) => {

                    const visiveis =
                        entradas
                            .filter(
                                (entrada) =>
                                    entrada.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (!visiveis.length) {
                        return;
                    }

                    const id =
                        visiveis[0].target.id;

                    linksMenu.forEach((link) => {

                        link.classList.toggle(
                            "ativo",
                            link.getAttribute(
                                "href"
                            ) === `#${id}`
                        );

                    });

                },
                {
                    rootMargin:
                        "-25% 0px -60% 0px",

                    threshold:
                        [0, 0.1, 0.25, 0.5]
                }
            );

        secoes.forEach((secao) => {
            secaoObserver.observe(secao);
        });
    }


    /* =====================================================
       LIGHTBOX DA GALERIA
    ====================================================== */

    const lightbox =
        document.querySelector(".lightbox");

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
            (indice + imagens.length) %
            imagens.length;

        const botao =
            imagens[indiceAtual];

        const src =
            botao.dataset.lightboxSrc;

        const alt =
            botao.dataset.lightboxAlt ||
            "Imagem ampliada da Orquestra Volpi";

        lightboxImagem.src = src;

        lightboxImagem.alt = alt;

        if (lightboxLegenda) {
            lightboxLegenda.textContent = alt;
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

        document.body.classList.add(
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

        document.body.classList.remove(
            "lightbox-aberto"
        );

        if (lightboxImagem) {
            lightboxImagem.src = "";
        }

        elementoAnteriorAoLightbox?.focus();

    }


    imagens.forEach(
        (botao, indice) => {

            botao.addEventListener(
                "click",
                () => {

                    abrirLightbox(indice);

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


    document.addEventListener(
        "keydown",
        (evento) => {

            if (
                !lightbox ||
                !lightbox.classList.contains(
                    "aberto"
                )
            ) {
                return;
            }

            if (evento.key === "Escape") {
                fecharLightbox();
            }

            if (
                evento.key ===
                "ArrowLeft"
            ) {
                mostrarImagem(
                    indiceAtual - 1
                );
            }

            if (
                evento.key ===
                "ArrowRight"
            ) {
                mostrarImagem(
                    indiceAtual + 1
                );
            }

        }
    );

});
