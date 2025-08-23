"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./utils/database"));
const auth_1 = require("./utils/auth");
const logger_1 = __importDefault(require("./utils/logger"));
async function main() {
    logger_1.default.info('Iniciando seed do banco de dados...');
    // Criar usuário demo
    const demoUser = await database_1.default.user.upsert({
        where: { email: 'demo@conexaoativa.app' },
        update: {},
        create: {
            email: 'demo@conexaoativa.app',
            passwordHash: await (0, auth_1.hashPassword)('demo123'),
            name: 'Usuário Demo',
            neighborhood: 'Centro',
            reputation: 50
        }
    });
    logger_1.default.info('Usuário demo criado:', { id: demoUser.id, email: demoUser.email });
    // Criar locais de Araguaína
    const places = [
        {
            name: 'Parque Cimba',
            type: 'TRACK',
            lat: -7.1917,
            lng: -48.2073,
            address: 'Av. Filadélfia, s/n - Setor Cimba, Araguaína - TO',
            isPublic: true
        },
        {
            name: 'Quadra JK',
            type: 'COURT',
            lat: -7.1895,
            lng: -48.2067,
            address: 'Rua JK, Centro, Araguaína - TO',
            isPublic: true
        },
        {
            name: 'Campo Society Vila Norte',
            type: 'FIELD',
            lat: -7.1823,
            lng: -48.2156,
            address: 'Vila Norte, Araguaína - TO',
            isPublic: true
        },
        {
            name: 'Ginásio IFTO',
            type: 'GYM',
            lat: -7.2089,
            lng: -48.2034,
            address: 'IFTO Campus Araguaína, Araguaína - TO',
            isPublic: true
        }
    ];
    const createdPlaces = [];
    for (const placeData of places) {
        const place = await database_1.default.place.upsert({
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
        logger_1.default.info('Local criado:', { id: place.id, name: place.name });
    }
    // Criar evento inicial (Corrida 5K amanhã às 07h no Parque Cimba)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    const parqueCimba = createdPlaces.find(p => p.name === 'Parque Cimba');
    if (parqueCimba) {
        const event = await database_1.default.event.upsert({
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
        logger_1.default.info('Evento demo criado:', { id: event.id, modality: event.modality });
    }
    logger_1.default.info('Seed concluído com sucesso!');
}
main()
    .catch((e) => {
    logger_1.default.error('Erro durante o seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await database_1.default.$disconnect();
});
