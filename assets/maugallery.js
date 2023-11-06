(function($) {
// Définition d'un plugin jQuery nommé mauGallery
  $.fn.mauGallery = function(options) {
    // Fusion des options par défaut et des options fournies
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
    // Création d'un wrapper de rangée
      $.fn.mauGallery.methods.createRowWrapper($(this));
      // Création d'une boîte à lumière (lightbox) si activée
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
// Ajout de gestionnaires d'événements
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          // Adaptation des éléments d'image
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
// Affichage des balises (tags) des éléments
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }
// Affichage du contenu
      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  // Options par défaut du plugin
  $.fn.mauGallery.listeners = function(options) {
    // Gestionnaire de clic pour les éléments de la galerie
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });
// Gestionnaire de clic pour les éléments de la galerie
$(".gallery-item").on("click", function() {
  if (options.lightBox && $(this).prop("tagName") === "IMG") {
      $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
  } else {
      return;
  }
});

// Gestionnaires de clic pour la navigation et la filtration par balises
$(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
$(".gallery").on("click", ".mg-prev", () =>
  $.fn.mauGallery.methods.prevImage(options.lightboxId)
);
$(".gallery").on("click", ".mg-next", () =>
  $.fn.mauGallery.methods.nextImage(options.lightboxId)
);

// Ajoutez des gestionnaires d'événements clavier pour les flèches gauche (37) et droite (39)
$(document).on("keydown", function(event) {
  if (event.which === 37) {
      // Touche de la flèche gauche (précédent)
      $.fn.mauGallery.methods.prevImage(options.lightboxId);
  } else if (event.which === 39) {
      // Touche de la flèche droite (suivant)
      $.fn.mauGallery.methods.nextImage(options.lightboxId);
  }
  });
};

// Méthodes du plugin
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
       // Crée un wrapper de rangée si inexistant
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      // Enveloppe un élément dans une colonne adaptative
      let columnClasses = '';
    
      if (typeof columns === 'number') {
        columnClasses = `col-${Math.ceil(12 / columns)}`;
      } else if (typeof columns === 'object') {
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
    
        columnClasses = breakpoints
          .map(breakpoint => columns[breakpoint] ? `col-${breakpoint}-${Math.ceil(12 / columns[breakpoint])}` : '')
          .join(' ');
      } else {
        console.error(`Les colonnes doivent être définies en tant que nombres ou objets. ${typeof columns} n'est pas pris en charge.`);
      }
    
      element.wrap(`<div class='item-column mb-4 ${columnClasses}'></div>`);
    },
// Déplace un élément dans le wrapper de rangée
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
// Rend une image fluide (responsive) si c'est une image    
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
// Ouvre la boîte à lumière (lightbox) avec l'image cliquée
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },

// Affiche l'image précédente dans la boîte à lumière (lightbox)
    prevImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i - 1;
        }
      });
      next =
        imagesCollection[index] ||
        imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
// Affiche l'image suivante dans la boîte à lumière (lightbox)   
    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i + 1;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
 // Crée une boîte à lumière (lightbox) avec la navigation (si activée)
createLightBox(gallery, lightboxId, navigation) {
  const navigationContent = navigation
    ? `
    <div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>
    <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clic"/>
    <div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">&gt;</div>
  `
    : '<span style="display:none;" />';

  gallery.append(`
    <div class="modal fade" id="${lightboxId || 'galleryLightbox'}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            ${navigationContent}
          </div>
        </div>
      </div>
    </div>
  `);
},   
// Affiche les balises (tags) des éléments
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

// Filtre les éléments par bal
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active.active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag active");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);


