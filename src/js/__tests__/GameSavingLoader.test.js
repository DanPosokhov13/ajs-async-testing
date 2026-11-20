import read from '../reader';
import GameSavingLoader from '../GameSavingLoader';
import GameSaving from '../GameSaving';

jest.mock('../reader');

function createBuffer(data) {
  const buffer = new ArrayBuffer(data.length * 2);
  const bufferView = new Uint16Array(buffer);

  for (let i = 0; i < data.length; i += 1) {
    bufferView[i] = data.charCodeAt(i);
  }

  return buffer;
}

const savingJson = '{"id":9,"created":1546300800,"userInfo":{"id":1,"name":"Hitman","level":10,"points":2000}}';

test('load resolves with GameSaving when read succeeds', async () => {
  read.mockResolvedValue(createBuffer(savingJson));

  const saving = await GameSavingLoader.load();

  expect(saving).toBeInstanceOf(GameSaving);
  expect(saving).toEqual({
    id: 9,
    created: 1546300800,
    userInfo: {
      id: 1,
      name: 'Hitman',
      level: 10,
      points: 2000,
    },
  });
});

test('load rejects when read fails', async () => {
  read.mockRejectedValue(new Error('read error'));

  await expect(GameSavingLoader.load()).rejects.toThrow('read error');
});
