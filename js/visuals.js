/** Real photography from Wikimedia Commons. Attribution in IMAGE_CREDITS.md. */
export const PHOTOS = {
  turtle: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Green-sea-turtle.jpg',
    local: 'assets/photos/turtle-hero.jpg',
    alt: 'Real underwater sea turtle image, frame extracted from the video supplied for PenyuGuard',
    credit: 'Frame from user-provided video, © original rights holder'
  },
  turtleClose: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Green_sea_turtle_underwater_animal.jpg',
    local: 'assets/photos/turtle-close.jpg',
    alt: 'Real underwater turtle footage still, provided for PenyuGuard',
    credit: 'Frame from user-provided video, © original rights holder'
  },
  reef: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Underwater_photo_of_coral_reef.jpg',
    local: 'assets/photos/underwater-reef.jpg',
    alt: 'Real underwater reef scene, frame from supplied sea turtle video',
    credit: 'Frame from user-provided video, © original rights holder'
  },
  turtleFws: {
    url: 'https://www.fws.gov/sites/default/files/2023-04/37437678176_e144d7d3f0_6k.jpg',
    local: 'assets/photos/turtle-fws.jpg',
    alt: 'Real underwater sea turtle footage still',
    credit: 'Frame from user-provided video, © original rights holder'
  },
  perhentian: {
    url: 'assets/ocean-turtle.svg',
    local: 'assets/photos/perhentian-beach.jpg',
    alt: 'Illustrative real underwater scene extracted from the user-supplied conservation video',
    credit: 'Frame from user-provided video, © original rights holder'
  }
,
  gallery1: { url: 'assets/ocean-turtle.svg', local: 'assets/photos/user-turtle-01.jpg', alt: 'Close-up turtle gliding through bright blue open water; user-provided illustrative image', credit: 'Image provided by the user; origin and reuse rights not independently verified' },
  gallery2: { url: 'assets/ocean-turtle.svg', local: 'assets/photos/user-turtle-02.jpg', alt: 'Sea turtle swimming above coral formations in deep turquoise water; user-provided illustrative image', credit: 'Image provided by the user; origin and reuse rights not independently verified' },
  gallery3: { url: 'assets/ocean-turtle.svg', local: 'assets/photos/user-turtle-03.jpg', alt: 'Sea turtle passing a reef with colorful fish and large coral; user-provided illustrative image', credit: 'Image provided by the user; origin and reuse rights not independently verified' },
  gallery4: { url: 'assets/ocean-turtle.svg', local: 'assets/photos/user-turtle-04.jpg', alt: 'Sea turtle surrounded by small colorful fish over a reef; user-provided illustrative image', credit: 'Image provided by the user; origin and reuse rights not independently verified' },
  gallery5: { url: 'assets/ocean-turtle.svg', local: 'assets/photos/user-turtle-05.jpg', alt: 'Sea turtle swimming beneath rays of sunlight at the ocean surface; user-provided illustrative image', credit: 'Image provided by the user; origin and reuse rights not independently verified' }
};
/** SVG only appears if the remote photo cannot load (e.g. offline). */
export function photo(key, cls='', eager=false) {
  const p=PHOTOS[key];
  if(!p) return '';
  return `<img class="${cls}" src="${p.local}" alt="${p.alt}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=function(){this.onerror=null;this.src='assets/ocean-turtle.svg';this.classList.add('photo-fallback')};this.src='${p.url}'">`;
}
