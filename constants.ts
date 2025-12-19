import { SizeSpec } from './types';

export const SIZE_DATA: SizeSpec[] = [
  {
    id: 'profile-pic',
    title: 'Foto de Perfil',
    category: 'profile',
    dimensions: '320 x 320 px',
    width: 320,
    height: 320,
    aspectRatio: '1:1',
    description: 'La imagen que te representa. Se muestra circular.',
    iconName: 'UserCircle',
    tips: [
      'Sube una imagen de al menos 320x320 para alta calidad.',
      'Centra los elementos importantes, las esquinas se recortan.',
      'Formatos: JPG o PNG.'
    ]
  },
  {
    id: 'feed-square',
    title: 'Post Cuadrado',
    category: 'feed',
    dimensions: '1080 x 1080 px',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'El clásico de Instagram. Se ve igual en el grid.',
    iconName: 'Square',
    tips: [
      'El formato más seguro y compatible.',
      'Ideal para carruseles mixtos.',
      'Resolución mínima recomendada: 1080px de ancho.'
    ]
  },
  {
    id: 'feed-portrait',
    title: 'Post Vertical (Retrato)',
    category: 'feed',
    dimensions: '1080 x 1350 px',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    description: 'Ocupa más espacio en pantalla = más atención.',
    iconName: 'Smartphone',
    tips: [
      'El formato con mayor engagement visual en el feed.',
      'Ojo: En el grid de perfil se recortará a 1:1 (cuadrado) desde el centro.',
      'Evita poner texto importante en los bordes superior e inferior.'
    ]
  },
  {
    id: 'feed-landscape',
    title: 'Post Horizontal',
    category: 'feed',
    dimensions: '1080 x 566 px',
    width: 1080,
    height: 566,
    aspectRatio: '1.91:1',
    description: 'Ideal para fotografía panorámica o cine.',
    iconName: 'Image',
    tips: [
      'Menos común porque ocupa poco espacio en el feed móvil.',
      'Puede ser difícil ver detalles pequeños.',
      'Requiere alta resolución para no perder calidad al escalar.'
    ]
  },
  {
    id: 'stories',
    title: 'Instagram Stories',
    category: 'story',
    dimensions: '1080 x 1920 px',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Contenido efímero a pantalla completa.',
    iconName: 'Clock',
    tips: [
      'Deja "zonas seguras" arriba y abajo (aprox 250px) para iconos de perfil y respuestas.',
      'Usa videos de menos de 60 segundos para que no se corten mal.',
      'El contenido centrado funciona mejor.'
    ]
  },
  {
    id: 'reels',
    title: 'Instagram Reels',
    category: 'reels',
    dimensions: '1080 x 1920 px',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Video vertical para máximo alcance viral.',
    iconName: 'Film',
    tips: [
      'La zona inferior se cubre con descripción y audio.',
      'En el feed principal se previsualiza en 4:5.',
      'Graba en alta calidad y buena luz.'
    ]
  },
  {
    id: 'igtv-cover',
    title: 'Portada de Video / Reels',
    category: 'video',
    dimensions: '420 x 654 px',
    width: 420,
    height: 654,
    aspectRatio: '1:1.55',
    description: 'La imagen estática que se ve antes de reproducir.',
    iconName: 'Image',
    tips: [
      'Es crucial para incitar al clic.',
      'Asegúrate de que el centro (1:1) sea atractivo para el grid de perfil.',
      'Puedes subir una imagen personalizada separada del video.'
    ]
  }
];