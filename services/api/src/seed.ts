import prisma from './utils/database';
import { hashPassword } from './utils/auth';
import logger from './utils/logger';

async function main() {
  logger.info('Iniciando seed do banco de dados...');

  // Criar usuário demo
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@conexaoativa.app' },
    update: {},
    create: {
      email: 'demo@conexaoativa.app',
      passwordHash: await hashPassword('demo123'),
      name: 'Usuário Demo',
      neighborhood: 'Centro',
      reputation: 50
    }
  });

  logger.info('Usuário demo criado:', { id: demoUser.id, email: demoUser.email });

  // Criar locais de Araguaína
  const places = [
    {
      name: 'Parque Cimba',
      type: 'TRACK' as const,
      lat: -7.1917,
      lng: -48.2073,
      address: 'Av. Filadélfia, s/n - Setor Cimba, Araguaína - TO',
      isPublic: true
    },
    {
      name: 'Quadra JK',
      type: 'COURT' as const,
      lat: -7.1895,
      lng: -48.2067,
      address: 'Rua JK, Centro, Araguaína - TO',
      isPublic: true
    },
    {
      name: 'Campo Society Vila Norte',
      type: 'FIELD' as const,
      lat: -7.1823,
      lng: -48.2156,
      address: 'Vila Norte, Araguaína - TO',
      isPublic: true
    },
    {
      name: 'Ginásio IFTO',
      type: 'GYM' as const,
      lat: -7.2089,
      lng: -48.2034,
      address: 'IFTO Campus Araguaína, Araguaína - TO',
      isPublic: true
    }
  ];

  const createdPlaces = [];
  for (const placeData of places) {
    const place = await prisma.place.upsert({
      where: { 
        id: placeData.name.toLowerCase().replace(/\s+/g, '-')
      },
      update: {},
      create: {
        ...placeData,
        id: placeData.name.toLowerCase().replace(/\s+/g, '-')
      }
    });
    createdPlaces.push(place);
    logger.info('Local criado:', { id: place.id, name: place.name });
  }

  // Criar evento inicial (Corrida 5K amanhã às 07h no Parque Cimba)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);

  const parqueCimba = createdPlaces.find(p => p.name === 'Parque Cimba');
  if (parqueCimba) {
    const event = await prisma.event.upsert({
      where: {
        id: 'demo-corrida-5k'
      },
      update: {},
      create: {
        id: 'demo-corrida-5k',
        modality: 'Corrida 5K',
        placeId: parqueCimba.id,
        ownerId: demoUser.id,
        startsAt: tomorrow,
        totalSpots: 10,
        status: 'OPEN'
      }
    });

    logger.info('Evento demo criado:', { id: event.id, modality: event.modality });
  }

  logger.info('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    logger.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

