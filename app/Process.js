import cheerio from 'react-native-cheerio';

export function processCourse(text, list) {
    var $ = cheerio.load(text),
        table = $('.table-class-even').children();

    
    for (let i = 0; i < table.length; i++) {
        row = $(table[i]).children();
        for (let j = row.length - 7; j < row.length; j++) {
            col = $(row[j]);       
            ans = col.find('div');

            console.log("j = " + (j - (row.length - 7)) + ", i = " + i);
            if (ans.length > 0) {
                for (let k = 0; k < ans.length; k++) {
                    let tmp = $(ans[k]).children('p');
                    createCourse($(ans[k]).children()[0].prev.data.trim(), $(tmp[0]).text(), $(tmp[1]).text(), list[j - (row.length - 7)][i]);
                }
            }
        }
    }
}

//function parseCell(node, table, depth) {
//    // 没有子节点且内容为空说明该节点表示的课程为空，且没有其他课程存在
//    if (node.children.length == 0 && node.innerHTML.trim() == "") {
//        // 创建一个空课程的解析表
//        if (depth == 0)
//            createCourse("", "", "", table);
//    // 长度不为零且内容为空则说明它的子节点为空
//    } else if (node.innerHTML.trim() == "") {
//        for (let i = 0; i < node.children.length; i++) {
//            parseCell(node.children[i], table, depth+1);
//        }
//    } else {
//        createCourse(node.innerHTML.trim(), node.children[0].innerHTML, node.children[1].innerHTML);
//        for (let i = 2; i < node.children.length; i++) {
//            parseCell(node.children[i], table, depth+1);
//        }
//    }
//}

function createCourse(coursename, classroom, weeks, table) {
    var obj;
    var matched = weeks.match(/\d+/g),
        start = parseInt(matched[0]),
        end = parseInt(matched[1]),
        startTime = parseInt(matched[2]),
        endTime = parseInt(matched[3]);

  //  console.log(coursename);
  //  console.log(classroom);
  //  console.log(weeks); 

    console.log("开始")
    for (let i = 0; i < table.length; i++) {
        if (table[i].coursename == coursename && table[i].classroom == classroom
            && table[i].starTime == starTime && table[i].endTime == endTime) 
        {
            console.log("week length is " + table[i].weeks.length)
            for (let j = 0; j < table[i].weeks.length; j++)
            {
                if (table[i].weeks[j].start == start && table[i].weeks[j].end == end)
                {
                    console.log("重复内容");
                    return
                }
            }

            table[i].weeks.push({
                start : start,
                end   : end,
            })
            console.log("中间")
            return;
        }
    }
    console.log("结束")

    table.push({
        "coursename" : coursename,
        "classroom" : classroom,
        "weeks" : [{
            "start" : start,
            "end"   : end,
        },],
        "startTime" : startTime,
        "endTime" : endTime
    });
}


//function test() {
//    var fs = require("fs");
//    var data = fs.readFileSync("./test.html", 'utf8');
//    var list = new Array(7);
//    
//    data = data.replace(/(\t)+\r\n/g, "");
//    
//    for (let i = 0; i  < list.length; i++) {
//        list[i] = new Array(5);
//        for (let j = 0; j < list[i].length; j++) {
//            list[i][j] = [];
//        }
//    }
//    processCourse(data, list);
//    console.log(JSON.stringify(list));
//}
