package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc15Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc15.class);
        Abc15 abc151 = new Abc15();
        abc151.setId(1L);
        Abc15 abc152 = new Abc15();
        abc152.setId(abc151.getId());
        assertThat(abc151).isEqualTo(abc152);
        abc152.setId(2L);
        assertThat(abc151).isNotEqualTo(abc152);
        abc151.setId(null);
        assertThat(abc151).isNotEqualTo(abc152);
    }
}
