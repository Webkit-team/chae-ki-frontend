import { Button, Link, Grid, Box, Container, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

import CustomTextField from '../atoms/CustomTextField';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SubTitle } from "../atoms/Text";
import qs from 'qs';
import { useCookies } from 'react-cookie';


const LoginContainer = () => {
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const loginData = {
            username: data.get("id"),
            password: data.get("password")
        };

        try {
            const response = await axios.post("http://localhost:8080/login",
                qs.stringify(loginData), // qs를 사용하여 URL-encoded 형식으로 변환
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );


            if (response.status === 200) {
                const jwt = response.headers.authorization;
                const user = {
                    uno: response.data.no,
                    username: response.data.username,
                    jwt: jwt
                }
                setCookie("user", user, { path: '/', 'max-age': 3600 }); // 1 hour
                
                navigate('/');

            } else {
                console.error("로그인 실패");
            }
        } catch (error) {
            console.error("ERROR : ", error);
        }
    };


    return (<>

        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: "center"
                }}
            >

                <SubTitle>로그인</SubTitle>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: "column", mt: "28px", alignItems: "center" }} >
                    <CustomTextField
                        autoFocus
                        margin="normal"
                        InputProps={{ startAdornment: (<IconButton tabIndex={-1}><PersonIcon /></IconButton>) }}
                        fullWidth
                        label="ID"
                        name="id"
                        id="id"
                    />

                    <CustomTextField
                        margin="normal"
                        InputProps={{ startAdornment: (<IconButton tabIndex={-1}><KeyIcon /></IconButton>) }}
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ width: 300, mt: 3, mb: 2 }}
                    >
                        로그인
                    </Button>

                    <Grid container>
                        <Grid item>
                            <Link href="signup" variant="body2">
                                {"아직 회원이 아니신가요?"}
                            </Link>
                        </Grid>

                        {/* 삭제 예정 */}
                        <Grid item>
                            <Link href="my" variant="body2">
                                {"마이페이지로"}
                            </Link>
                        </Grid>
                    </Grid>

                </Box>
            </Box>

        </Container>

    </>);
}

export default LoginContainer;