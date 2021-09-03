import React, { useState, useEffect } from 'react';
import Memory from '../components/Memory.jsx';
import CPU from '../components/CPU.jsx';
import ClusterInfo from '../components/ClusterInfo.jsx';
import DiskUsage from '../components/DiskUsage.jsx';
import loading from '../assets/loading.gif';

const mainContainerGraphQL = () => {
  const [cpu, setCPU] = useState({});
  const [totalDisk, setTotalDisk] = useState({});
  const [freeDisk, setFreeDisk] = useState({});
  const [nodeMemory, setNodeMemory] = useState({});
  const [clusterInfo, setClusterInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [nodeNums, setNodeNums] = useState([]);
  const [called, setCalled] = useState(false);

  const sixHours = 21600;
  // const endTime = Math.floor(Date.now() / 1000);
  const startTime = "1630286575";
  const endTime = "1630358575";
  // const startTime = endTime - sixHours;
  const step = "5m";
  

  useEffect( () => {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          getFreeDiskSpace(startTime: "1630524326" , endTime: "1630596330", step: "5m") {
            data {
              result {
                metric {
                  instance
                }
                values
              }
            }
          }
          getNodeCpu(startTime: "1630524326", endTime: "1630596330", step: "5m") {
            data {
              result {
                metric {
                  instance
                }
                values
              }
            }
          }
          getClusterInfo {
            data {
              result {
                metric {
                  internal_ip
                  node
                }
                value
              }
            }
          }
          getNodeMemory {
            data {
              result {
                metric {
                  instance
                }
                value
              }
            }
          }
          getTotalDiskSpace {
            data {
              result {
                metric {
                  instance
                }
                value
              }
            }
          }
        }`
      })
    }).then((res)=> res.json()).then(res => {
      const data = res.data
      console.log(data)
      console.log('data.getNodeCpi', data.getNodeCpu);
      setCPU(data.getNodeCpu);
      setTotalDisk(data.getTotalDiskSpace);
      setFreeDisk(data.getFreeDiskSpace);
      setNodeMemory(data.getNodeMemory);
      setClusterInfo(data.getClusterInfo);
      setIsLoading(false);


    })
  
   
  }, []);

  if (!isLoading && !called) {
    console.log('clusterinfo', clusterInfo)
    const result = [];
    for (let i = 1; i <= clusterInfo.data.result.length; i++) {
      // create nodes 1 through x based on internal Ip addresses
      result.push(clusterInfo.data.result[i - 1].metric.internal_ip);
    }
    setNodeNums(result);
    setCalled(true);
  }

   return ((isLoading) ? 
    <img id='loading' src={loading} />
    : 
    <div className='main-container'>
      <div id='CPU' className='components'>
        <CPU cpu={cpu} nodeNums={nodeNums} />
      </div>
      <div className='components' id='Memory'>
        <Memory nodeMemory={nodeMemory} nodeNums={nodeNums} />
      </div>
      <div id='disk-usage' className='components'>
        <DiskUsage total={totalDisk} free={freeDisk} nodeNums={nodeNums} />
      </div>
      <div id='clusterInfo' className='components'>
        <ClusterInfo clusterInfo={clusterInfo} />
      </div>
    </div>
  );
};

export default mainContainerGraphQL;