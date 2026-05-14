import fs from 'fs';
import JSZip from 'jszip';



async function squidlyGridTopics2OpenBoardFormat(topics) {
  const boards = {}

  await Promise.all(Object.entries(topics).map(async ([topicId, topic]) => {
    const [columns, rows] = topic.size.split('x').map(Number);

    const buttons = [];
    const gridCells = [];
    const images = []

    await Promise.all(topic.items.map(async (item, index) => {
      const buttonId = String(index + 1);
      const imgURL = item.symbol?.url;
      const imgID = item.symbol?.id;

      if (imgURL) {
          images.push({
            id: imgID,
            url: imgURL,
            content_type: 'image/png',
            width: 100
          });
      }

      const button = {
        id: buttonId,
        label: item.displayValue,
        image_id: imgID
      };

      if (item.topicUID) {
        button.load_board = {
            "name": topics[item.topicUID] ? topics[item.topicUID].name : `Board ${item.topicUID}`,
            "path": `boards/${item.topicUID}.obf`,
        }
      }

      if (item.hidden) {
        button.hidden = true;
      }

      if (item.utterance) {
        button.vocalization = item.utterance;
      }

      buttons.push(button);

      gridCells.push(item.hidden ? null : buttonId);
    }));

    // Build 2D grid order (rows × columns)
    const order = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        const cellIndex = r * columns + c;
        row.push(cellIndex < gridCells.length ? gridCells[cellIndex] : null);
      }
      order.push(row);
    }

    boards[topicId] = {
      format: 'open-board-0.1',
      id: topicId,
      locale: 'en',
      name: topic.name,
      buttons,
      grid: { rows, columns, order },
      images,
      sounds: []
    }
  }));

  return boards
}

async function zipOpenBoardFormat(boards, root) {
   const zip = new JSZip();

   for (const [boardId, board] of Object.entries(boards)) {
      zip.file(`boards/${boardId}.obf`, JSON.stringify(board, null, 2));
   }

   const manifest = {
      format: "open-board-0.1",
      paths: {
         boards: Object.fromEntries(Object.entries(boards).map(([id, board]) => [id, `boards/${id}.obf`])),
      }
   };

   if (root) {
      manifest.root = `boards/${root}.obf`;
   }

   zip.file('manifest.json', JSON.stringify(manifest, null, 2));

   const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

async function test() {
    const data = fs.readFileSync('squidly.json', 'utf-8');
    const topics = JSON.parse(data);


    const boards = await squidlyGridTopics2OpenBoardFormat(topics);
    const zipBlob = await zipOpenBoardFormat(boards,"-OLqvyYjEIPALztTqM1N");
    //save zipBlob to disk 
    fs.writeFileSync('open-board-format.obz', await zipBlob.bytes());
}


test();
